import PosyanduApps from '@/components/apps/posyandu/components-apps-posyandu';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Posyandu',
};

const Posyandu = () => {
    return <PosyanduApps />;
};

export default Posyandu;
