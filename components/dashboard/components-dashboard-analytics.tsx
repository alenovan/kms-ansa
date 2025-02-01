'use client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import Link from 'next/link';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const ComponentsDashboardAnalytics = () => {
    const [dataCheckup, setDataCheckup] = useState<any>([]);

    const [chartBerat, setChartBerat] = useState<any>(null);
    const [chartTinggi, setChartTinggi] = useState<any>(null);
    const [chartGender, setChartGender] = useState<any>(null);
    const [chartBulanan, setChartBulanan] = useState<any>(null);
    const [chartStatus, setChartStatus] = useState<any>(null);

    const fetchDataCheckup = async () => {
        try {
            const response = await axios.get('/api/v1/intl/checkup');
            setDataCheckup(response.data.data);
            prosesDataGrafik(response.data.data);
        } catch (error) {
            // showPesan('Gagal memuat data checkup', 'error');
        }
    };

    useEffect(() => {
        fetchDataCheckup();
    }, []);

    const prosesDataGrafik = (data: any) => {
        const dataTersortir = data.sort((a: any, b: any) => new Date(a.checkupDate).getTime() - new Date(b.checkupDate).getTime());
        const tanggalCheckup = dataTersortir.map((item: any) => new Date(item.checkupDate).toLocaleDateString());
        const nilaiBerat = dataTersortir.map((item: any) => item.weight);
        const nilaiTinggi = dataTersortir.map((item: any) => item.height);

        setChartBerat({
            series: [{ name: 'Berat Badan (kg)', data: nilaiBerat }],
            options: {
                chart: { type: 'line' },
                xaxis: { categories: tanggalCheckup },
                title: { text: '' },
            },
        });

        setChartTinggi({
            series: [{ name: 'Tinggi Badan (cm)', data: nilaiTinggi }],
            options: {
                chart: { type: 'line' },
                xaxis: { categories: tanggalCheckup },
                title: { text: '' },
            },
        });

        const genderCount = data.reduce((acc: any, item: any) => {
            const gender = item.member.gender === 'F' ? 'Perempuan' : 'Laki-laki';
            acc[gender] = (acc[gender] || 0) + 1;
            return acc;
        }, {});

        setChartGender({
            series: Object.values(genderCount),
            options: {
                chart: { type: 'pie' },
                labels: Object.keys(genderCount),
                title: { text: '    ' },
            },
        });

        const jumlahBulanan = data.reduce((acc: any, item: any) => {
            const bulan = new Date(item.createdAt).toLocaleString('id-ID', { month: 'short', year: 'numeric' });
            acc[bulan] = (acc[bulan] || 0) + 1;
            return acc;
        }, {});

        setChartBulanan({
            series: [{ name: 'Checkup', data: Object.values(jumlahBulanan) }],
            options: {
                chart: { type: 'bar' },
                xaxis: { categories: Object.keys(jumlahBulanan) },
                title: { text: '' },
            },
        });

        // Menambahkan penghitungan untuk status anak: Stunting, Gizi Buruk, Obesitas, dan Normal
        const statusCount = data.reduce((acc: any, item: any) => {
            // Memecah status yang mungkin terdiri dari beberapa bagian seperti "Stunting, Obesitas"
            const statuses = item.status ? item.status.split(', ') : ['Normal']; // Jika tidak ada status, dianggap 'Normal'
        
            statuses.forEach((status: string) => {
                acc[status] = (acc[status] || 0) + 1;
            });
        
            return acc;
        }, {});
        
        const statusColors: { [key: string]: string } = {
            'Normal': '#28a745',      // Green for 'Normal'
            'Stunting': '#dc3545',    // Red for 'Stunting'
            'Gizi Buruk': '#fd7e14',  // Orange for 'Gizi Buruk'
            'Obesitas': '#007bff',    // Blue for 'Obesitas'
        };
        
        // Assign colors dynamically based on the status labels
        const chartColors = Object.keys(statusCount).map(status => statusColors[status] || '#6c757d'); // Default to gray if status not mapped
        
        setChartStatus({
            series: Object.values(statusCount),
            options: {
                chart: { type: 'pie' },
                labels: Object.keys(statusCount),
                colors: chartColors, // Apply custom colors
                title: { text: '' },
            },
        });
        
    };

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="/" className="text-primary hover:underline">
                        Beranda
                    </Link>
                </li>
            </ul>
            <div className="pt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Kartu Grafik Pertumbuhan Berat Badan */}
                {chartBerat && (
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">Pertumbuhan Berat Badan</h3>
                        <ReactApexChart options={chartBerat.options} series={chartBerat.series} type="line" height={350} />
                    </div>
                )}

                {/* Kartu Grafik Pertumbuhan Tinggi Badan */}
                {chartTinggi && (
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">Pertumbuhan Tinggi Badan</h3>
                        <ReactApexChart options={chartTinggi.options} series={chartTinggi.series} type="line" height={350} />
                    </div>
                )}

                {/* Kartu Grafik Distribusi Jenis Kelamin */}
                {chartGender && (
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">Distribusi Jenis Kelamin</h3>
                        <ReactApexChart options={chartGender.options} series={chartGender.series} type="pie" height={350} />
                    </div>
                )}

                {/* Kartu Grafik Jumlah Checkup Per Bulan */}
                {chartBulanan && (
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">Jumlah Checkup Per Bulan</h3>
                        <ReactApexChart options={chartBulanan.options} series={chartBulanan.series} type="bar" height={350} />
                    </div>
                )}

                {/* Kartu Grafik Distribusi Status Anak */}
                {chartStatus && (
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">Distribusi Status Kesehatan</h3>
                        <ReactApexChart options={chartStatus.options} series={chartStatus.series} type="pie" height={350} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComponentsDashboardAnalytics;
