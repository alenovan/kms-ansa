import PuskesmasApps from '@/components/apps/puskesmas/components-apps-puskesmas';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Puskesmas',
};

const Puskesmas = () => {
    return <PuskesmasApps />;
};

export default Puskesmas;
