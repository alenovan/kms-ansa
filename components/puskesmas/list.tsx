'use client';

import IconSearch from '@/components/icon/icon-search';
import IconUserPlus from '@/components/icon/icon-user-plus';
import IconX from '@/components/icon/icon-x';
import { Transition, Dialog, TransitionChild, DialogPanel } from '@headlessui/react';
import React, { Fragment, useEffect, useLayoutEffect, useState } from 'react';
import Select from 'react-select';
import { createPuskesmas, deletePuskesmas, getPuskesmass, updatePuskesmas } from '@/services/puskesmas';
import { useFormMutation } from '@/hooks/useFormMutation';
import { getCities, getProvinces, getSubDistricts, getVillages } from '@/services/master';
import Swal from 'sweetalert2';
import { useSession } from 'next-auth/react';

const ComponentPuskesmas = () => {
    const { data: session } = useSession();

    const [modal, setModal] = useState<boolean>(false);
    const [initialValues, setInitialValues] = useState({ id: '', provinceId: '', cityId: '', subDistrictId: '', villageId: '', name: '', address: '' });
    const [list, setList] = useState<any | null>({ data: [], meta: { currentPage: 1, totalPages: 0, totalCount: 0 } });
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [province, setProvince] = useState<any | null>([]);
    const [city, setCity] = useState<any | null>([]);
    const [subDistrict, setSubDistrict] = useState<any | null>([]);
    const [village, setVilage] = useState<any | null>([]);

    const fetchMaster = async () => {
        const data = await getProvinces();
        // const dataCity = await getCities();
        // const dataSubDisctrict = await getSubDistricts();
        // const dataVillages = await getVillages();

        setProvince(
            data?.map((x) => {
                return { label: x.name, value: x.id };
            }),
        );
        // setCity(
        //     dataCity?.map((x) => {
        //         return { label: x.name, value: x.id };
        //     }),
        // );
        // setSubDistrict(
        //     dataSubDisctrict?.map((x) => {
        //         return { label: x.name, value: x.id };
        //     }),
        // );
        // setVilage(
        //     dataVillages?.map((x) => {
        //         return { label: x.name, value: x.id };
        //     }),
        // );
    };

    const fetchData = async () => {
        const data = await getPuskesmass({ search, page: page });

        setList(data);
    };

    useLayoutEffect(() => {
        fetchData();
        fetchMaster();
    }, []);

    useEffect(() => {
        fetchData();
    }, [page, search]);

    const { isPending, handleFormSubmit, error } = useFormMutation({
        actions: async (formData) => {
            if (initialValues.id) {
                return await updatePuskesmas(initialValues.id, formData);
            } else {
                return await createPuskesmas(formData);
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
                <h2 className="text-xl">Puskesmas</h2>
                <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    {session?.user.role.toLowerCase() !== 'dinas' && (
                        <div className="flex gap-3">
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setModal(true);
                                        setInitialValues({ id: '', provinceId: '', cityId: '', subDistrictId: '', villageId: '', name: '', address: '' });
                                    }}
                                >
                                    <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                                    Tambah Puskesmas
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search Puskesmas"
                            className="peer form-input py-2 ltr:pr-11 rtl:pl-11"
                            value={search}
                            onChange={(e) => {
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
                                <th>Nama</th>
                                <th>Provinsi</th>
                                <th>Kota</th>
                                <th>Kecamtan</th>
                                <th>Kelurahan</th>
                                <th>Alamat</th>
                                {session?.user.role.toLowerCase() !== 'dinas' && <th className="!text-center">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {list.data?.map((x: any) => {
                                return (
                                    <tr key={x.id}>
                                        <td>{x.name}</td>
                                        <td>{x.province.name}</td>
                                        <td>{x.city.name}</td>
                                        <td>{x.subdistrict.name}</td>
                                        <td>{x.village.name}</td>
                                        <td>{x.address}</td>
                                        {session?.user.role.toLowerCase() !== 'dinas' && (
                                            <td>
                                                <div className="flex items-center justify-center gap-4">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={async () => {
                                                            const dataCity = await getCities({ provinceId: x.provinceId });
                                                            const dataSubDisctrict = await getSubDistricts({ cityId: x.cityId });
                                                            const dataVillages = await getVillages({ subDistrictId: x.subDistrictId });

                                                            setCity(
                                                                dataCity?.map((x) => {
                                                                    return { label: x.name, value: x.id };
                                                                }),
                                                            );
                                                            setSubDistrict(
                                                                dataSubDisctrict?.map((x) => {
                                                                    return { label: x.name, value: x.id };
                                                                }),
                                                            );
                                                            setVilage(
                                                                dataVillages?.map((x) => {
                                                                    return { label: x.name, value: x.id };
                                                                }),
                                                            );
                                                            setInitialValues({
                                                                id: x.id,
                                                                provinceId: x.provinceId,
                                                                cityId: x.cityId,
                                                                subDistrictId: x.subDistrictId,
                                                                villageId: x.villageId,
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
                                                                    const data = await deletePuskesmas(x.id);
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
                                        {initialValues.id ? 'Edit Puskesmas' : 'Add Puskesmas'}
                                    </div>
                                    <div className="p-5">
                                        <form onSubmit={handleFormSubmit}>
                                            <div className="mb-5">
                                                <label htmlFor="name">Nama</label>
                                                <input id="name" name="name" type="text" placeholder="Nama" className="form-input" defaultValue={initialValues.name} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="provinsi">Provinsi</label>
                                                <Select
                                                    defaultValue={province.find((x: any) => x.value === initialValues.provinceId)}
                                                    options={province}
                                                    name="provinceId"
                                                    isSearchable={true}
                                                    onChange={async (e) => {
                                                        const data = await getCities({ provinceId: e.value });
                                                        console.log(e);
                                                        setCity(
                                                            data?.map((x) => {
                                                                return { label: x.name, value: x.id };
                                                            }),
                                                        );
                                                    }}
                                                />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="kota">Kota</label>
                                                <Select
                                                    defaultValue={city.find((x: any) => x.value === initialValues.cityId)}
                                                    options={city}
                                                    name="cityId"
                                                    isSearchable={true}
                                                    onChange={async (e) => {
                                                        const data = await getSubDistricts({ cityId: e.value });
                                                        setSubDistrict(
                                                            data?.map((x) => {
                                                                return { label: x.name, value: x.id };
                                                            }),
                                                        );
                                                    }}
                                                />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="kecamatan">Kecamatan</label>
                                                <Select
                                                    defaultValue={subDistrict.find((x: any) => x.value === initialValues.subDistrictId)}
                                                    options={subDistrict}
                                                    name="subDistrictId"
                                                    isSearchable={true}
                                                    onChange={async (e) => {
                                                        const data = await getVillages({ subDistrictId: e.value });
                                                        setVilage(
                                                            data?.map((x) => {
                                                                return { label: x.name, value: x.id };
                                                            }),
                                                        );
                                                    }}
                                                />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="kelurahan">Kelurahan</label>
                                                <Select defaultValue={village.find((x: any) => x.value === initialValues.villageId)} options={village} name="villageId" isSearchable={true} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="alamat">Alamat</label>
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

export default ComponentPuskesmas;
