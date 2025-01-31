import CheckupDetail from '@/components/apps/checkup/components-apps-detail';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Detail Checkup',
};

const Contacts = () => {
    return <CheckupDetail />;
};

export default Contacts;
