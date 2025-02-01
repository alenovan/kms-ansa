import ProviderComponent from '@/components/layouts/provider-component';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '../styles/tailwind.css';
import { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';

export const metadata: Metadata = {
    title: {
        template: '%s | UKUR MANDIRI DIGITAL STUNTING',
        default: 'KURMA DS - UKUR MANDIRI DIGITAL STUNTING',
    },
};
const nunito = Nunito({
    weight: ['400', '500', '600', '700', '800'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-nunito',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={nunito.variable}>
                <ProviderComponent>
                    <SessionProvider>{children}</SessionProvider>
                </ProviderComponent>
            </body>
        </html>
    );
}
