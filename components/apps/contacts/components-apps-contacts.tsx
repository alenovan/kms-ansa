'use client';

import IconSearch from '@/components/icon/icon-search';
import IconUserPlus from '@/components/icon/icon-user-plus';
import IconX from '@/components/icon/icon-x';
import { Transition, Dialog, TransitionChild, DialogPanel } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import Link from 'next/link';
import { deleteMember } from '@/services/member';

const ComponentsAppsUsers = () => {
    const [addUserModal, setAddUserModal] = useState(false);
    const [value, setValue] = useState('list');
    const [defaultParams] = useState({
        id: null,
        nik: '',
        name: '',
        gender: '',
        dateOfBirth: '',
        motherName: '',
    });
    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));
    const [search, setSearch] = useState('');
    const [filteredItems, setFilteredItems] = useState<any>([]);

    // Fetch users from API
    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/v1/intl/member'); // Replace with your API endpoint
            setFilteredItems(response.data);
        } catch (error) {
            showMessage('Failed to load users', 'error');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };

    const searchUser = () => {
        // setFilteredItems(() => {
        //     return filteredItems?.data?.filter((item: any) => {
        //         return item.name.toLowerCase().includes(search.toLowerCase());
        //     });
        // });
    };

    useEffect(() => {
        searchUser();
    }, [search]);

    const saveUser = async () => {
        // if (!params.name || !params.nik || !params.dateOfBirth || !params.motherName) {
        //     showMessage('All fields are required.', 'error');
        //     return;
        // }

        if (params.id) {
            // Update user
            try {
                const response = await axios.put(`/api/v1/intl/member/${params.id}`, params); // Update API endpoint
                fetchUsers();
                showMessage('User updated successfully.');
            } catch (error) {
                showMessage('Failed to update user', 'error');
            }
        } else {
            // Add new user
            try {
                const response = await axios.post('/api/v1/intl/member', params); // Add user API endpoint
                fetchUsers();
                showMessage('User added successfully.');
            } catch (error) {
                console.log(error);
                showMessage('Failed to add user', 'error');
            }
        }

        setAddUserModal(false);
    };

    const editUser = (user: any = null) => {
        const json = JSON.parse(JSON.stringify(defaultParams));
        setParams(json);
        if (user) {
            let json1 = JSON.parse(JSON.stringify(user));
            setParams(json1);
        }
        setAddUserModal(true);
    };

    const deleteUser = async (user: any) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            showCancelButton: true,
            confirmButtonText: 'Delete',
            padding: '2em',
            customClass: { popup: 'sweet-alerts' },
        }).then(async (result) => {
            if (result.value) {
                const data = await deleteMember(user.id);
                if (data.success) {
                    Swal.fire({ title: 'Deleted!', text: 'Your file has been deleted.', icon: 'success', customClass: { popup: 'sweet-alerts' } });
                    fetchUsers();
                }
            }
        });
    };

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
                <h2 className="text-xl">Peserta</h2>
                <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    <div className="flex gap-3">
                        <div>
                            {/* <button type="button" className="btn btn-primary" onClick={() => editUser()}>
                                <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                                Tambah Peserta
                            </button> */}
                        </div>
                    </div>
                    <div className="relative">
                        {/* <input type="text" placeholder="Search Users" className="peer form-input py-2 ltr:pr-11 rtl:pl-11" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <button type="button" className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-[11px] rtl:left-[11px]">
                            <IconSearch className="mx-auto" />
                        </button> */}
                    </div>
                </div>
            </div>

            {value === 'list' && (
                <div className="panel mt-5 overflow-hidden border-0 p-0">
                    <div className="table-responsive">
                        <table className="table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>NIK</th>
                                    <th>Nama</th>
                                    <th>Tanggal lahir</th>
                                    <th>Nama Ibu</th>
                                    <th className="!text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems?.data?.map((contact: any) => {
                                    return (
                                        <tr key={contact.nik}>
                                            <td>{contact.nik}</td>
                                            <td>{contact.name}</td>
                                            <td>{new Date(contact.dateOfBirth).toLocaleDateString()}</td>
                                            <td>{contact.motherName}</td>
                                            <td>
                                                <div className="flex items-center justify-center gap-4">
                                                    <Link href={`/checkup/${contact.nik}`} passHref>
                                                        <button type="button" className="btn btn-sm btn-outline-primary">
                                                            Riwayat Checkup
                                                        </button>
                                                    </Link>
                                                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editUser(contact)}>
                                                        Edit
                                                    </button>
                                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteUser(contact)}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Transition appear show={addUserModal} as={Fragment}>
                <Dialog as="div" open={addUserModal} onClose={() => setAddUserModal(false)} className="relative z-50">
                    <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </TransitionChild>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={() => setAddUserModal(false)}
                                        className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]">
                                        {params.id ? 'Edit Peserta' : 'Add Peserta'}
                                    </div>
                                    <div className="p-5">
                                        <form>
                                            <div className="mb-5">
                                                <label htmlFor="nik">NIK</label>
                                                <input id="nik" type="text" placeholder="Enter NIK" className="form-input" value={params.nik} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="name">Nama</label>
                                                <input id="name" type="text" placeholder="Enter Name" className="form-input" value={params.name} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="gender">Jenis Kelamin</label>
                                                <div className="flex gap-x-3">
                                                    <input type="radio" checked={params.gender === 'M'} id="gender" value={'M'} onChange={(e) => changeValue(e)} /> Laki-laki
                                                    <input type="radio" checked={params.gender === 'F'} id="gender" value={'F'} onChange={(e) => changeValue(e)} /> Perempuan
                                                </div>
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="dateOfBirth">Tanggal Lahir</label>
                                                <input id="dateOfBirth" type="date" placeholder="Tanggal Lahir" className="form-input" value={params.dateOfBirth} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="motherName">Nama Ibu</label>
                                                <input id="motherName" type="text" placeholder="Nama Ibu" className="form-input" value={params.motherName} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mt-8 flex items-center justify-end">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setAddUserModal(false)}>
                                                    Cancel
                                                </button>
                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={saveUser}>
                                                    {params.id ? 'Update' : 'Add'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default ComponentsAppsUsers;
