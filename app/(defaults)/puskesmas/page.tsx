import ComponentPuskesmas from '@/components/puskesmas/list';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Puskesmas',
};

const Puskesmass = () => {
    return <ComponentPuskesmas />;
};

export default Puskesmass;
