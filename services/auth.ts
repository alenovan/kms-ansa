'use server';

import { signIn } from '@/auth';
import { CredentialsSignin } from 'next-auth';

export const signInAction = async (formData: FormData, callbackUrl: string, rememberMe: boolean) => {
    try {
        const { email, password } = Object.fromEntries(formData);

        await signIn('credentials', {
            redirect: false,
            email: email as string,
            remember_me: rememberMe,
            password: password as string,
            redirectTo: callbackUrl,
        });
    } catch (error) {
        if (error instanceof CredentialsSignin) {
            return {
                error: error.message,
            };
        }
    }

    return { message: 'Login Success' };
};
