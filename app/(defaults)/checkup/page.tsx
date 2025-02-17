import ComponentCheckup from '@/components/checkup/list';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Checkup',
};

const Checkups = () => {
    return <ComponentCheckup />;
};

export default Checkups;
