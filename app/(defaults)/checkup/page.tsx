import CheckupApps from '@/components/checkup/components-apps-checkup';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Puskesmas',
};

const Contacts = () => {
    return <CheckupApps />;
};

export default Contacts;
