'use client';

import IconSearch from '@/components/icon/icon-search';
import IconUserPlus from '@/components/icon/icon-user-plus';
import IconX from '@/components/icon/icon-x';
import { useFormMutation } from '@/hooks/useFormMutation';
import { createMember, deleteMember, getMembers, updateMember } from '@/services/member';
import { getPosyandu } from '@/services/posyandu';
import { formatDate } from '@/utils/helpers';
import { Transition, Dialog, TransitionChild, DialogPanel } from '@headlessui/react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import React, { Fragment, useEffect, useLayoutEffect, useState } from 'react';
import Swal from 'sweetalert2';

const ComponentPosyanduDetail = () => {
    const router = useRouter();
    const params = useParams();
    const { data: session } = useSession();

    const [modal, setModal] = useState<boolean>(false);
    const [initialValues, setInitialValues] = useState({ id: '', nik: '', name: '', gender: '', dateOfBirth: '', motherName: '', posyanduId: '' });
    const [list, setList] = useState<any | null>({ data: [], meta: { currentPage: 1, totalPages: 0, totalCount: 0 } });
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [detail, setDetail] = useState<any | null>({});

    const fetchData = async () => {
        const data = await getMembers({ posyanduId: `${params?.id}`, search, page: page });
        const detail = await getPosyandu(`${params?.id}`);

        setList(data);
        setDetail(detail);
    };

    useLayoutEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchData();
    }, [page, search]);

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
            <div className="panel">
                <div className="flex flex-wrap justify-between gap-4 px-4">
                    <div className="text-2xl font-semibold uppercase">{detail?.name}</div>
                </div>

                <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                <div className="flex flex-col flex-wrap justify-between gap-6 lg:flex-row">
                    <div className="flex flex-col justify-between gap-6 sm:flex-row lg:w-2/3">
                        <div className="xl:1/3 sm:w-1/2 lg:w-2/5">
                            <div className="mb-2 flex w-full items-center justify-between">
                                <div className="text-white-dark">Puskesmas :</div>
                                <div>{detail?.puskesmas?.name}</div>
                            </div>
                            <div className="mb-2 flex w-full items-center justify-between">
                                <div className="text-white-dark">Alamat :</div>
                                <div>{detail?.address}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-xl">Peserta</h2>
                    <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                        {session?.user.role.toLowerCase() !== 'dinas' && (
                            <div className="flex gap-3">
                                <div>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => {
                                            setModal(true);
                                            setInitialValues({ id: '', nik: '', name: '', gender: '', dateOfBirth: '', motherName: '', posyanduId: '' });
                                        }}
                                    >
                                        <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                                        Tambah Peserta
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search Users"
                                className="peer form-input py-2 ltr:pr-11 rtl:pl-11"
                                value={search}
                                onChange={async (e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                            />
                            <button type="button" className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-[11px] rtl:left-[11px]">
                                <IconSearch className="mx-auto" />
                            </button>
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
                                {list.data?.map((x: any) => {
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

                {list.meta?.totalPages !== 0 && (
                    <div className="mt-4">
                        <ul className="inline-flex items-center space-x-1 rtl:space-x-reverse m-auto mb-4">
                            {1 !== page && (
                                <>
                                    <li>
                                        <button
                                            type="button"
                                            className="flex justify-center font-semibold px-3.5 py-2 rounded transition text-dark hover:text-primary border-2 border-white-light dark:border-[#191e3a] hover:border-primary dark:hover:border-primary dark:text-white-light"
                                            onClick={() => setPage(1)}
                                        >
                                            First
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            className="flex justify-center font-semibold px-3.5 py-2 rounded transition text-dark hover:text-primary border-2 border-white-light dark:border-[#191e3a] hover:border-primary dark:hover:border-primary dark:text-white-light"
                                            onClick={() => setPage(page - 1)}
                                        >
                                            Prev
                                        </button>
                                    </li>
                                </>
                            )}
                            {Array.from(Array(list.meta?.totalPages).keys()).map((x) => {
                                return (
                                    <li key={x}>
                                        <button
                                            type="button"
                                            className={
                                                x + 1 === list.meta?.currentPage
                                                    ? `flex justify-center font-semibold px-3.5 py-2 rounded transition text-primary border-2 border-primary dark:border-primary dark:text-white-light`
                                                    : `flex justify-center font-semibold px-3.5 py-2 rounded transition text-dark hover:text-primary border-2 border-white-light dark:border-[#191e3a] hover:border-primary dark:hover:border-primary dark:text-white-light`
                                            }
                                            onClick={() => setPage(x + 1)}
                                        >
                                            {x + 1}
                                        </button>
                                    </li>
                                );
                            })}
                            {list.meta?.totalPages !== page && (
                                <>
                                    <li>
                                        <button
                                            type="button"
                                            className="flex justify-center font-semibold px-3.5 py-2 rounded transition text-dark hover:text-primary border-2 border-white-light dark:border-[#191e3a] hover:border-primary dark:hover:border-primary dark:text-white-light"
                                            onClick={() => setPage(page + 1)}
                                        >
                                            Next
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            className="flex justify-center font-semibold px-3.5 py-2 rounded transition text-dark hover:text-primary border-2 border-white-light dark:border-[#191e3a] hover:border-primary dark:hover:border-primary dark:text-white-light"
                                            onClick={() => setPage(list.meta?.totalPages)}
                                        >
                                            Last
                                        </button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                )}

                <Transition appear show={modal} as={Fragment}>
                    <Dialog as="div" open={modal} onClose={() => setModal(false)} className="relative z-50">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
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
        </div>
    );
};

export default ComponentPosyanduDetail;
