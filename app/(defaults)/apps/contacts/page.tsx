import ComponentsAppsContacts from '@/components/apps/member/list';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Contacts',
};

const Contacts = () => {
    return <ComponentsAppsContacts />;
};

export default Contacts;
