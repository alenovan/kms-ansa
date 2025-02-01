import PosyanduDetail from '@/components/apps/posyandu/detail';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Posyandu',
};

const Posyandu = () => {
    return <PosyanduDetail />;
};

export default Posyandu;
