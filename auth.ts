import { prisma } from '@/lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth, { CredentialsSignin, DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { hashPassword } from './utils/helpers';
import { signInSchema } from './lib/zod';
import { getUser, getUserByEmail } from './services/user';

class InvalidLoginError extends CredentialsSignin {
    static message: string;
    constructor(message?: any) {
        super();

        this.message = message;
    }
}

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            emailVerified: string;
            role: string;
        } & DefaultSession['user'];
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
                remember_me: {},
            },
            authorize: async (credentials) => {
                const { email, password } = await signInSchema.parseAsync(credentials);
                const user = await getUserByEmail(email);
                if (user?.password === hashPassword(password)) {
                    return user;
                }

                throw new InvalidLoginError('Invalid credentials.');
            },
        }),
    ],
    callbacks: {
        async authorized({ auth, request: { nextUrl } }) {
            const loggedIn = !!auth?.user;

            const protectedPaths = ['/dashboard', '/users', '/checkup', '/puskesmas', '/posyandu'];
            const isProtected = protectedPaths.some((path) => nextUrl.pathname.startsWith(path));

            // If trying to access a protected route without being logged in, redirect to login
            if (isProtected && !loggedIn) {
                const redirectUrl = new URL('/auth/login', nextUrl.origin);
                redirectUrl.searchParams.append('callbackUrl', nextUrl.pathname);

                return Response.redirect(redirectUrl);
            }

            // If trying to access a public route but already logged in, redirect to dashboard
            const publicPath = ['/auth'];
            const isPublic = publicPath.some((path) => nextUrl.pathname.startsWith(path));
            if (isPublic && loggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl.origin));
            }

            return true;
        },

        async jwt({ token }) {
            // If a session token is found, fetch user data to include it in the token
            if (token.sub) {
                const data = await getUser(token.sub);
                if (data) {
                    return {
                        ...token,
                        emailVerified: data.emailVerified,
                        role: data.role.name,
                    };
                }
            }
            return token;
        },

        async session({ session, token }) {
            // Attach additional user information to session
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.sub,
                    emailVerified: token.emailVerified,
                    role: token.role,
                },
            };
        },
    },
    pages: { signIn: '/auth/login' },
    session: { strategy: 'jwt' },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24,
            },
        },
    },
});
