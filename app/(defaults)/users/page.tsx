import ComponentUser from '@/components/users/list';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Pengguna',
};

const Users = () => {
    return <ComponentUser />;
};

export default Users;
