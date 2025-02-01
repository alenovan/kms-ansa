'use client';

import IconSearch from '@/components/icon/icon-search';
import IconUserPlus from '@/components/icon/icon-user-plus';
import IconX from '@/components/icon/icon-x';
import { useFormMutation } from '@/hooks/useFormMutation';
import { createPosyandu, deletePosyandu, getPosyandus, updatePosyandu } from '@/services/posyandu';
import { getPuskesmass } from '@/services/puskesmas';
import { Transition, Dialog, TransitionChild, DialogPanel } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import React, { Fragment, useLayoutEffect, useState } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';

const PosyanduApps = () => {
    const router = useRouter();

    const [modal, setModal] = useState<boolean>(false);
    const [initialValues, setInitialValues] = useState({ id: '', puskesmasId: '', name: '', address: '' });
    const [list, setList] = useState<any | null>([]);
    const [puskesmas, setPuskesmas] = useState<any | null>([]);

    const fetchMaster = async () => {
        const data = await getPuskesmass();

        setPuskesmas(
            data?.map((x) => {
                return { label: x.name, value: x.id };
            }),
        );
    };

    const fetchData = async () => {
        const data = await getPosyandus();

        setList(data);
    };

    useLayoutEffect(() => {
        fetchData();
        fetchMaster();
    }, []);

    const { isPending, handleFormSubmit, error } = useFormMutation({
        actions: async (formData) => {
            if (initialValues.id) {
                return await updatePosyandu(initialValues.id, formData);
            } else {
                return await createPosyandu(formData);
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
                <h2 className="text-xl">Posyandu</h2>
                <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    <div className="flex gap-3">
                        <div>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                    setModal(true);
                                    setInitialValues({ id: '', puskesmasId: '', name: '', address: '' });
                                }}
                            >
                                <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                                Tambah Posyandu
                            </button>
                        </div>
                    </div>
                    {/* <div className="relative">
                        <input type="text" placeholder="Search Users" className="peer form-input py-2 ltr:pr-11 rtl:pl-11" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <button type="button" className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-[11px] rtl:left-[11px]">
                            <IconSearch className="mx-auto" />
                        </button>
                    </div> */}
                </div>
            </div>
            <div className="panel mt-5 overflow-hidden border-0 p-0">
                <div className="table-responsive">
                    <table className="table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Posyandu</th>
                                <th>Puskesmas</th>
                                <th>Alamat</th>
                                <th className="!text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list?.map((x: any) => {
                                return (
                                    <tr key={x.id}>
                                        <td>{x.name}</td>
                                        <td>{x.puskesmas.name}</td>
                                        <td>{x.address}</td>
                                        <td>
                                            <div className="flex items-center justify-center gap-4">
                                                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => router.push('/posyandu/' + x.id)}>
                                                    Lihat
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => {
                                                        setInitialValues({
                                                            id: x.id,
                                                            puskesmasId: x.puskesmasId,
                                                            name: x.name,
                                                            address: x.address,
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
                                                                const data = await deletePosyandu(x.id);
                                                                if (data.success) {
                                                                    Swal.fire({ title: 'Deleted!', text: 'Your file has been deleted.', icon: 'success', customClass: { popup: 'sweet-alerts' } });
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
                                        {initialValues.id ? 'Edit Posyandu' : 'Add Posyandu'}
                                    </div>
                                    <div className="p-5">
                                        <form onSubmit={handleFormSubmit}>
                                            <div className="mb-5">
                                                <label htmlFor="puskesmasId">Puskesmas</label>
                                                <Select defaultValue={puskesmas?.find((x: any) => x.value === initialValues.puskesmasId)} options={puskesmas} name="puskesmasId" isSearchable={false} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="name">Nama</label>
                                                <input id="name" name="name" type="text" placeholder="Nama" className="form-input" defaultValue={initialValues.name} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="address">Alamat</label>
                                                <input id="alamat" name="address" type="text" placeholder="Alamat" className="form-input" defaultValue={initialValues.address} />
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

export default PosyanduApps;
