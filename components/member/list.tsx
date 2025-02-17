'use client';

import IconSearch from '@/components/icon/icon-search';
import IconUserPlus from '@/components/icon/icon-user-plus';
import IconX from '@/components/icon/icon-x';
import { Transition, Dialog, TransitionChild, DialogPanel } from '@headlessui/react';
import React, { Fragment, useLayoutEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { createMember, deleteMember, getMembers, updateMember } from '@/services/member';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useFormMutation } from '@/hooks/useFormMutation';
import { formatDate } from '@/utils/helpers';

const ComponentMember = () => {
    const params = useParams();
    const { data: session } = useSession();

    const [modal, setModal] = useState<boolean>(false);
    const [initialValues, setInitialValues] = useState({ id: '', nik: '', name: '', gender: '', dateOfBirth: '', motherName: '', posyanduId: '' });
    const [list, setList] = useState<any | null>([]);

    const fetchData = async () => {
        const data = await getMembers({ posyanduId: `${params?.id}` });

        setList(data);
    };

    useLayoutEffect(() => {
        fetchData();
    }, []);

    const { isPending, handleFormSubmit, error } = useFormMutation({
        actions: async (formData) => {
            if (initialValues.id) {
                return await updateMember(initialValues.id, formData);
            } else {
                return await createMember(formData);
            }
        },
        onSuccess: (res) => {
            setModal(false);
            fetchData();
        },
    });

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

            <div className="panel mt-5 overflow-hidden border-0 p-0">
                <div className="table-responsive">
                    <table className="table-striped table-hover">
                        <thead>
                            <tr>
                                <th>NIK</th>
                                <th>Nama</th>
                                <th>Jenis Kelamin</th>
                                <th>Tanggal lahir</th>
                                <th>Nama Ibu</th>
                                {session?.user.role.toLowerCase() !== 'dinas' && <th className="!text-center">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((x: any) => {
                                return (
                                    <tr key={x.id}>
                                        <td>{x.nik}</td>
                                        <td>{x.name}</td>
                                        <td>{x.gender}</td>
                                        <td>{formatDate(x.dateOfBirth)}</td>
                                        <td>{x.motherName}</td>
                                        {session?.user.role.toLowerCase() !== 'dinas' && (
                                            <td>
                                                <div className="flex items-center justify-center gap-4">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => {
                                                            setInitialValues({
                                                                id: x.id,
                                                                nik: x.nik,
                                                                name: x.name,
                                                                gender: x.gender,
                                                                dateOfBirth: x.dateOfBirth,
                                                                motherName: x.motherName,
                                                                posyanduId: x.posyanduId,
                                                            });
                                                            setModal(true);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => {
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
                                                                    const data = await deleteMember(x.id);
                                                                    if (data.success) {
                                                                        Swal.fire({
                                                                            title: 'Deleted!',
                                                                            text: 'Your file has been deleted.',
                                                                            icon: 'success',
                                                                            customClass: { popup: 'sweet-alerts' },
                                                                        });
                                                                        fetchData();
                                                                    }
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <Transition appear show={modal} as={Fragment}>
                <Dialog as="div" open={modal} onClose={() => setModal(false)} className="relative z-50">
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
                                        onClick={() => setModal(false)}
                                        className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]">
                                        {initialValues.id ? 'Edit Peserta' : 'Add Peserta'}
                                    </div>
                                    <div className="p-5">
                                        <form onSubmit={handleFormSubmit}>
                                            <div className="mb-5">
                                                <label htmlFor="nik">NIK</label>
                                                <input id="nik" name="nik" type="text" placeholder="NIK" className="form-input" defaultValue={initialValues.nik} />
                                                <input name="posyanduId" type="hidden" value={params.id} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="name">Nama</label>
                                                <input id="name" name="name" type="text" placeholder="Nama" className="form-input" defaultValue={initialValues.name} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="gender">Jenis Kelamin</label>
                                                <div className="flex gap-x-3">
                                                    <input type="radio" defaultChecked={initialValues.gender === 'M'} id="gender" name="gender" value={'M'} /> Laki-laki
                                                    <input type="radio" defaultChecked={initialValues.gender === 'F'} id="gender" name="gender" value={'F'} /> Perempuan
                                                </div>
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="dateOfBirth">Tanggal Lahir</label>
                                                <input
                                                    id="dateOfBirth"
                                                    name="dateOfBirth"
                                                    type="date"
                                                    placeholder="Tanggal Lahir"
                                                    className="form-input"
                                                    defaultValue={initialValues.dateOfBirth ? new Date(initialValues.dateOfBirth).toISOString().split('T')[0] : ''}
                                                />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="motherName">Nama Ibu</label>
                                                <input id="motherName" name="motherName" type="text" placeholder="Nama Ibu" className="form-input" defaultValue={initialValues.motherName} />
                                            </div>
                                            <div className="mt-8 flex items-center justify-end">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setModal(false)}>
                                                    Cancel
                                                </button>
                                                <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                    {initialValues.id ? 'Update' : 'Add'}
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

export default ComponentMember;
