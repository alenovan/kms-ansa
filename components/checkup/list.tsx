'use client';

import IconSearch from '@/components/icon/icon-search';
import { useEffect, useLayoutEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { createMedicalRecord, getCheckups, updateMedicalRecord } from '@/services/checkup';

const ComponentCheckup = () => {
    const [list, setList] = useState<any | null>({ data: [], meta: { currentPage: 1, totalPages: 0, totalCount: 0 } });
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);

    const fetchData = async () => {
        const data = await getCheckups({ search, page: page });

        setList(data);
    };

    useLayoutEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchData();
    }, [page, search]);

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

    const showStatusPopup = (status: string, checkupId: string, memberId: string, medicalRecordId: string | null, existingTreatments: string | null) => {
        const diagnoses = status ? status.split(',').map((s) => s.trim()) : ['Normal'];

        // Parse the stringified array to an actual array
        const treatmentsArray = existingTreatments ? JSON.parse(existingTreatments) : [];

        let inputsHtml = diagnoses
            .map(
                (diag, index) =>
                    `<p><strong>Diagnosis ${index + 1}:</strong> ${diag}</p>
                        <textarea id='treatment-${index}' class='swal2-textarea' 
                        style='width: 100%; height: 120px; font-size: 16px; padding: 10px;'
                        placeholder='Masukkan perawatan untuk ${diag}'>${treatmentsArray[index] || ''}</textarea>
                        ${index < diagnoses.length - 1 ? '<hr>' : ''}`,
            )
            .join('');

        Swal.fire({
            title: 'Treatment Diagnosis',
            html: inputsHtml,
            width: '60vw', // Adjust the width as needed
            customClass: {
                popup: 'swal-custom-popup', // Custom class for further styling
            },
            showCancelButton: true,
            confirmButtonText: 'Simpan',
            preConfirm: () => {
                const treatments = diagnoses.map((_, index) => {
                    return (document.getElementById(`treatment-${index}`) as HTMLTextAreaElement).value;
                });
                return { treatments };
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const formData = new FormData();
                    formData.append('memberId', memberId);
                    formData.append('checkupId', checkupId);
                    formData.append('diagnosis', status);
                    formData.append('treatment', JSON.stringify(result.value.treatments));

                    let response;
                    if (medicalRecordId) {
                        response = await updateMedicalRecord(medicalRecordId, formData);
                    } else {
                        response = await createMedicalRecord(formData);
                    }

                    if (response.success) {
                        showMessage('Perawatan disimpan!', 'success');
                    } else {
                        showMessage('Gagal menyimpan perawatan', 'error');
                    }
                    fetchData();
                } catch (error) {
                    showMessage('Terjadi kesalahan saat menyimpan perawatan', 'error');
                }
            }
        });
    };

    // Add this to your global CSS file to further tweak styling
    const styles = document.createElement('style');
    styles.innerHTML = `
            .swal-custom-popup {
                font-size: 18px;
            }
            .swal2-textarea {
                width: 100%;
                min-height: 120px !important;
                font-size: 16px;
                padding: 10px;
            }
        `;
    document.head.appendChild(styles);

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl">Checkup Data</h2>
                <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search Checkups"
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
                                <th>Member</th>
                                <th>Status</th>
                                <th>Height</th>
                                <th>Weight</th>
                                <th>Age</th>
                                <th>Checkup Date</th>
                                <th>Catatan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.data?.map((checkup: any) => {
                                return (
                                    <tr key={checkup.id}>
                                        <td>{checkup.member.name}</td>
                                        <td>{checkup.status || 'Normal'}</td>
                                        <td>{checkup.height}</td>
                                        <td>{checkup.weight}</td>
                                        <td>{checkup.age} Bulan</td>
                                        <td>{new Date(checkup.checkupDate).toLocaleString()}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => showStatusPopup(checkup.status, checkup.id, checkup.member.id, checkup.medicalRecords[0]?.id, checkup.medicalRecords[0]?.treatment)}
                                            >
                                                Catatan
                                            </button>
                                        </td>
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
        </div>
    );
};

export default ComponentCheckup;
