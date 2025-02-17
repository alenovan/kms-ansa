'use client';

import React, { useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import Link from 'next/link';
import ReactApexChart from 'react-apexcharts';
import { getCheckupDashboard } from '@/services/checkup';

const ComponentsDashboardAnalytics = () => {
    const [chartBerat, setChartBerat] = useState<any>(null);
    const [chartTinggi, setChartTinggi] = useState<any>(null);
    const [chartGender, setChartGender] = useState<any>(null);
    const [chartBulanan, setChartBulanan] = useState<any>(null);
    const [chartStatus, setChartStatus] = useState<any>(null);

    const fetchData = async () => {
        const data = await getCheckupDashboard();

        prosesDataGrafik(data);
    };

    useLayoutEffect(() => {
        fetchData();
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

        const statusCount = data.reduce((acc: any, item: any) => {
            const statuses = item.status ? item.status.split(', ') : ['Normal']; // Jika tidak ada status, dianggap 'Normal'

            statuses.forEach((status: string) => {
                acc[status] = (acc[status] || 0) + 1;
            });

            return acc;
        }, {});

        const statusColors: { [key: string]: string } = {
            Normal: '#28a745',
            Stunting: '#dc3545',
            'Gizi Buruk': '#fd7e14',
            Obesitas: '#007bff',
        };

        const chartColors = Object.keys(statusCount).map((status) => statusColors[status] || '#6c757d'); // Default to gray if status not mapped

        setChartStatus({
            series: Object.values(statusCount),
            options: {
                chart: { type: 'pie' },
                labels: Object.keys(statusCount),
                colors: chartColors,
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
                {chartBerat && (
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">Pertumbuhan Berat Badan</h3>
                        <ReactApexChart options={chartBerat.options} series={chartBerat.series} type="line" height={350} />
                    </div>
                )}

                {chartTinggi && (
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">Pertumbuhan Tinggi Badan</h3>
                        <ReactApexChart options={chartTinggi.options} series={chartTinggi.series} type="line" height={350} />
                    </div>
                )}

                {chartGender && (
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">Distribusi Jenis Kelamin</h3>
                        <ReactApexChart options={chartGender.options} series={chartGender.series} type="pie" height={350} />
                    </div>
                )}

                {chartBulanan && (
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">Jumlah Checkup Per Bulan</h3>
                        <ReactApexChart options={chartBulanan.options} series={chartBulanan.series} type="bar" height={350} />
                    </div>
                )}

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
