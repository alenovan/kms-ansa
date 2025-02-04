import ComponentMember from '@/components/member/list';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Peserta',
};

const Members = () => {
    return <ComponentMember />;
};

export default Members;
