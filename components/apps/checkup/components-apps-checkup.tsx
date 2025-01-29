'use client';

import IconSearch from '@/components/icon/icon-search';
import { Transition, Dialog, TransitionChild, DialogPanel } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

const Checkup = () => {
    const [addUserModal, setAddUserModal] = useState(false);
    const [value, setValue] = useState('list');
    const [filteredItems, setFilteredItems] = useState<any>([]);

    // Fetch checkup data from API
    useEffect(() => {
        const fetchCheckups = async () => {
            try {
                const response = await axios.get('/api/v1/intl/checkup'); // Updated endpoint for checkup data
                setFilteredItems(response.data.data); // Assuming checkup data is under 'data'
            } catch (error) {
                showMessage('Failed to load checkup data', 'error');
            }
        };
        fetchCheckups();
    }, []);

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl">Checkup Data</h2>
                <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    <div className="relative">
                        <input type="text" placeholder="Search Checkups" className="peer form-input py-2 ltr:pr-11 rtl:pl-11" />
                        <button type="button" className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-[11px] rtl:left-[11px]">
                            <IconSearch className="mx-auto" />
                        </button>
                    </div>
                </div>
            </div>

            {value === 'list' && (
                <div className="panel mt-5 overflow-hidden border-0 p-0">
                    <div className="table-responsive">
                        <table className="table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Member</th>
                                    <th>Status</th>
                                    <th>Height</th>
                                    <th>Weight</th>
                                    <th>Checkup Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((checkup: any) => {
                                    return (
                                        <tr key={checkup.id}>
                                            <td>{checkup.memberId}</td>
                                            <td>{checkup.status}</td>
                                            <td>{checkup.height}</td>
                                            <td>{checkup.weight}</td>
                                            <td>{new Date(checkup.checkupDate).toLocaleString()}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkup;
