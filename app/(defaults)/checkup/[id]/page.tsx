import ComponentCheckupDetail from '@/components/checkup/detail';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Detail Checkup',
};

const Checkup = () => {
    return <ComponentCheckupDetail />;
};

export default Checkup;
