'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const Index = () => {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the index page
        router.push('/dashboard');
    }, [router]);

    return <></>;
};

export default Index;
