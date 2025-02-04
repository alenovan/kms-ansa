import ComponentPosyandu from '@/components/posyandu/list';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Posyandu',
};

const Posyandus = () => {
    return <ComponentPosyandu />;
};

export default Posyandus;
