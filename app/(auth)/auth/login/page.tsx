import ComponentsAuthLoginForm from '@/components/auth/components-auth-login-form';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
    title: 'Login Boxed',
};

const BoxedSignIn = () => {
    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>

            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 px-6 py-20 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px]">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Login</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Silahkan login menggunakan email dan password anda</p>
                            </div>
                            <ComponentsAuthLoginForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoxedSignIn;
