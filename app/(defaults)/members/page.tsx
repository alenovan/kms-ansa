import ComponentMember from '@/components/apps/member/list';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Peserta',
};

const Members = () => {
    return <ComponentMember />;
};

export default Members;
