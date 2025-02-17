'use client';

import IconSearch from '@/components/icon/icon-search';
import { useEffect, useLayoutEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { createMedicalRecord, getCheckups, updateMedicalRecord } from '@/services/checkup';
import { getMember } from '@/services/member';

// Import dynamic ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const ComponentCheckupDetail = () => {
    const params = useParams();

    const [heightSeries, setHeightSeries] = useState<any[]>([]);
    const [weightSeries, setWeightSeries] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [member, setMember] = useState<any>(null); // Store member profile data
    const [list, setList] = useState<any | null>([]);

    const fetchData = async () => {
        const data = await getCheckups();
        const profile = await getMember(`${params?.id}`);
        const sortedData = data?.sort((a: any, b: any) => new Date(a.checkupDate).getTime() - new Date(b.checkupDate).getTime());
        const heights = sortedData?.map((item: any) => item.height);
        const weights = sortedData?.map((item: any) => item.weight);
        const dates = sortedData?.map((item: any) => new Date(item.checkupDate).toLocaleDateString());

        setList(sortedData);
        setMember(profile);
        setHeightSeries([{ name: 'Tinggi Badan (cm)', data: heights }]);
        setWeightSeries([{ name: 'Berat Badan (kg)', data: weights }]);
        setCategories(dates || []);
    };

    useLayoutEffect(() => {
        fetchData();
    }, [params?.id]);

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
                        // Update existing medical record
                        response = await updateMedicalRecord(medicalRecordId, formData);
                    } else {
                        // Create a new medical record
                        response = await createMedicalRecord(formData);
                    }

                    if (response.success) {
                        showMessage('Perawatan disimpan!', 'success');
                    } else {
                        showMessage('Gagal menyimpan perawatan', 'error');
                    }
                    await fetchData();
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
            {/* Member Profile Section */}

            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl">Detail Pemeriksaan</h2>
                <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    <div className="relative">
                        {/* <input type="text" placeholder="Cari Pemeriksaan" className="peer form-input py-2 ltr:pr-11 rtl:pl-11" /> */}
                        {/* <button type="button" className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-[11px] rtl:left-[11px]">
                            <IconSearch className="mx-auto" />
                        </button> */}
                    </div>
                </div>
            </div>
            {member && (
                <div className="panel p-6 border rounded-lg bg-white shadow-md mb-6 mt-10">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-2xl text-gray-600 font-semibold">{member.name.charAt(0)}</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{member.name}</h2>
                            <p className="text-lg text-gray-600">
                                NIK: <span className="font-medium">{member.nik}</span>
                            </p>
                            <p className="text-lg text-gray-600">
                                Jenis Kelamin: <span className="font-medium">{member.gender === 'M' ? 'Laki-laki' : 'Perempuan'}</span>
                            </p>
                            <p className="text-lg text-gray-600">
                                Tanggal Lahir: <span className="font-medium">{new Date(member.dateOfBirth).toLocaleDateString()}</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Grafik Pertumbuhan Tinggi Badan dan Berat Badan sejajar */}
            {/* Grafik Pertumbuhan Tinggi Badan dan Berat Badan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                {/* Grafik Pertumbuhan Tinggi Badan */}
                <div className="panel p-5 border rounded-lg bg-white shadow-md">
                    <h3 className="text-lg font-semibold mb-3">Grafik Pertumbuhan Tinggi Badan</h3>
                    <Chart
                        options={{
                            chart: { type: 'line', toolbar: { show: false } },
                            xaxis: { categories },
                            stroke: { curve: 'smooth' },
                        }}
                        series={heightSeries}
                        type="line"
                        height={300}
                    />
                </div>

                {/* Grafik Pertumbuhan Berat Badan */}
                <div className="panel p-5 border rounded-lg bg-white shadow-md">
                    <h3 className="text-lg font-semibold mb-3">Grafik Pertumbuhan Berat Badan</h3>
                    <Chart
                        options={{
                            chart: { type: 'line', toolbar: { show: false } },
                            xaxis: { categories },
                            stroke: { curve: 'smooth' },
                        }}
                        series={weightSeries}
                        type="line"
                        height={300}
                    />
                </div>
            </div>

            {/* Saran Kesehatan untuk Anak */}
            <div className="panel mt-5 p-5 border rounded-lg bg-white shadow-md">
                <h3 className="text-lg font-semibold mb-3">Saran Kesehatan untuk Anak</h3>
                <ul className="list-disc pl-5">
                    <li>Pastikan anak mendapatkan cukup tidur sesuai dengan usia mereka.</li>
                    <li>Konsultasikan dengan dokter secara rutin untuk memantau perkembangan tinggi dan berat badan anak.</li>
                    <li>Berikan makanan bergizi yang seimbang untuk mendukung pertumbuhan yang optimal.</li>
                    <li>Ajak anak berolahraga secara teratur untuk meningkatkan kesehatan tubuh secara keseluruhan.</li>
                    <li>Jaga kebersihan dan lakukan pemeriksaan kesehatan secara rutin untuk mencegah penyakit.</li>
                </ul>
            </div>

            {/* Tabel Detail Pemeriksaan */}
            <div className="panel mt-5 overflow-hidden border-0 p-0">
                <div className="table-responsive">
                    <table className="table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Anggota</th>
                                <th>Status</th>
                                <th>Tinggi Badan</th>
                                <th>Berat Badan</th>
                                <th>Usia</th>
                                <th>Tanggal Pemeriksaan</th>
                                <th>Catatan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((checkup: any) => (
                                <tr key={checkup.id}>
                                    <td>{checkup.member.name}</td>
                                    <td>{checkup.status || 'Normal'}</td>
                                    <td>{checkup.height} cm</td>
                                    <td>{checkup.weight} kg</td>
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ComponentCheckupDetail;
