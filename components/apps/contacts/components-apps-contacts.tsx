'use client';

import IconFacebook from '@/components/icon/icon-facebook';
import IconInstagram from '@/components/icon/icon-instagram';
import IconLinkedin from '@/components/icon/icon-linkedin';
import IconSearch from '@/components/icon/icon-search';
import IconTwitter from '@/components/icon/icon-twitter';
import IconUser from '@/components/icon/icon-user';
import IconUserPlus from '@/components/icon/icon-user-plus';
import IconX from '@/components/icon/icon-x';
import { Transition, Dialog, TransitionChild, DialogPanel } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const ComponentsAppsUsers = () => {
    const [addUserModal, setAddUserModal] = useState<any>(false);

    const [value, setValue] = useState<any>('list');
    const [defaultParams] = useState({
        id: null,
        nik: '',
        name: '',
        birthDate: '',
        motherName: '',
    });

    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));

    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };

    const [search, setSearch] = useState<any>('');
    const [contactList] = useState<any>([
        {
            id: 1,
            nik: '1234567890123456',
            name: 'Alan Green',
            birthDate: '1985-06-15',
            motherName: 'Sarah Green',
        },
        {
            id: 2,
            nik: '1234567890123457',
            name: 'Linda Nelson',
            birthDate: '1990-08-22',
            motherName: 'Emma Nelson',
        },
        {
            id: 3,
            nik: '1234567890123458',
            name: 'Lila Perry',
            birthDate: '1995-03-10',
            motherName: 'Sophia Perry',
        },
        {
            id: 4,
            nik: '1234567890123459',
            name: 'Andy King',
            birthDate: '1982-12-05',
            motherName: 'Grace King',
        },
        {
            id: 5,
            nik: '1234567890123460',
            name: 'Jesse Cory',
            birthDate: '1988-07-19',
            motherName: 'Olivia Cory',
        },
        {
            id: 6,
            nik: '1234567890123461',
            name: 'Xavier',
            birthDate: '1993-09-25',
            motherName: 'Isabella Xavier',
        },
        {
            id: 7,
            nik: '1234567890123462',
            name: 'Susan',
            birthDate: '1987-04-30',
            motherName: 'Eleanor Susan',
        },
        {
            id: 8,
            nik: '1234567890123463',
            name: 'Raci Lopez',
            birthDate: '1992-11-14',
            motherName: 'Martha Lopez',
        },
        {
            id: 9,
            nik: '1234567890123464',
            name: 'Steven Mendoza',
            birthDate: '1980-06-02',
            motherName: 'Patricia Mendoza',
        },
        {
            id: 10,
            nik: '1234567890123465',
            name: 'James Cantrell',
            birthDate: '1991-02-18',
            motherName: 'Deborah Cantrell',
        },
        {
            id: 11,
            nik: '1234567890123466',
            name: 'Reginald Brown',
            birthDate: '1986-05-08',
            motherName: 'Margaret Brown',
        },
        {
            id: 12,
            nik: '1234567890123467',
            name: 'Stacey Smith',
            birthDate: '1994-10-21',
            motherName: 'Brenda Smith',
        },
    ]);

    const [filteredItems, setFilteredItems] = useState<any>(contactList);

    const searchUser = () => {
        setFilteredItems(() => {
            return contactList.filter((item: any) => {
                return item.name.toLowerCase().includes(search.toLowerCase());
            });
        });
    };

    useEffect(() => {
        searchUser();
    }, [search]);

    const saveUser = () => {
        if (!params.name) {
            showMessage('Name  Wajib.', 'error');
            return true;
        }
        if (!params.nik) {
            showMessage('Nik  Wajib.', 'error');
            return true;
        }
        if (!params.birthDate) {
            showMessage('Tanggal Lahir  Wajib.', 'error');
            return true;
        }
        if (!params.motherName) {
            showMessage('Nama Ibu  Wajib.', 'error');
            return true;
        }

        if (params.id) {
            //update user
            let user: any = filteredItems.find((d: any) => d.id === params.id);
            user.nik = params.nik;
            user.name = params.name;
            user.birthDate = params.birthDate;
            user.motherName = params.motherName;
        } else {
            //add user
            let maxUserId = filteredItems.length ? filteredItems.reduce((max: any, character: any) => (character.id > max ? character.id : max), filteredItems[0].id) : 0;

            let user = {
                id: maxUserId + 1,
                nik: params.nik,
                birthDate: params.birthDate,
                motherName: params.motherName,
            };
            filteredItems.splice(0, 0, user);
            //   searchUsers();
        }

        showMessage('Peserta has been saved successfully.');
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

    const deleteUser = (user: any = null) => {
        setFilteredItems(filteredItems.filter((d: any) => d.id !== user.id));
        showMessage('User has been deleted successfully.');
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
                            <button type="button" className="btn btn-primary" onClick={() => editUser()}>
                                <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                                Tambah Peserta
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <input type="text" placeholder="Search Users" className="peer form-input py-2 ltr:pr-11 rtl:pl-11" value={search} onChange={(e) => setSearch(e.target.value)} />
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
                                    <th>NIK</th>
                                    <th>Nama</th>
                                    <th>Tanggal lahir</th>
                                    <th>Nama Ibu</th>
                                    <th className="!text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((contact: any) => {
                                    return (
                                        <tr key={contact.nik}>
                                            <td>{contact.nik}</td>
                                            <td>{contact.name}</td>
                                            <td>{contact.birthDate}</td>
                                            <td>{contact.motherName}</td>
                                            <td>
                                                <div className="flex items-center justify-center gap-4">
                                                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editUser(contact)}>
                                                        Riwayat Checkup
                                                    </button>
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
            ``
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
                                                <label htmlFor="name">NIK</label>
                                                <input id="nik" type="text" placeholder="Enter Name" className="form-input" value={params.nik} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="name">Nama</label>
                                                <input id="name" type="text" placeholder="Enter Name" className="form-input" value={params.name} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="email">Tangagl Lahir</label>
                                                <input id="birthDate" type="date" placeholder="Tanggal Lahir" className="form-input" value={params.birthDate} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="number">Nama Ibu</label>
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
