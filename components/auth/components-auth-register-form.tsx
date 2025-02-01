'use client';

import IconUser from '@/components/icon/icon-user';
import { IRootState } from '@/store';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { useSelector } from 'react-redux';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import IconMenuCalendar from '../icon/menu/icon-menu-calendar';
import IconMenuDocumentation from '../icon/menu/icon-menu-documentation';
import { useFormMutation } from '@/hooks/useFormMutation';
import { createMember } from '@/services/member';

const ComponentsAuthRegisterForm = () => {
    const router = useRouter();
    const params = useParams();
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const { isPending, handleFormSubmit, error } = useFormMutation({
        actions: async (formData) => {
            return await createMember(formData);
        },
        onSuccess: (res) => {
            router.push('/auth/login');
        },
    });

    return (
        <form className="space-y-5 dark:text-white" onSubmit={handleFormSubmit}>
            <div>
                <label htmlFor="NIK">NIK</label>
                <div className="relative text-white-dark">
                    <input id="NIK" name="nik" type="text" placeholder="NIK" className="form-input ps-10 placeholder:text-white-dark" />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconMenuDocumentation />
                    </span>
                </div>
                <input name="posyanduId" type="hidden" value={params.code} />
            </div>
            <div>
                <label htmlFor="Name">Nama</label>
                <div className="relative text-white-dark">
                    <input id="Name" name="name" type="text" placeholder="Nama" className="form-input ps-10 placeholder:text-white-dark" />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconUser fill={true} />
                    </span>
                </div>
            </div>
            <div>
                <label htmlFor="gender">Jenis Kelamin</label>
                <div className="flex gap-x-3">
                    <input type="radio" id="gender" name="gender" value={'M'} /> Laki-laki
                    <input type="radio" id="gender" name="gender" value={'F'} /> Perempuan
                </div>
            </div>
            <div>
                <label htmlFor="BirthDay">Tanggal Lahir</label>
                <div className="relative text-white-dark">
                    <Flatpickr
                        options={{ dateFormat: 'Y-m-d', position: isRtl ? 'auto right' : 'auto left' }}
                        className="form-input ps-10 placeholder:text-white-dark"
                        placeholder="Pilih Tanggal Lahir"
                        name="dateOfBirth"
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconMenuCalendar />
                    </span>
                </div>
            </div>
            <div>
                <label htmlFor="MothersName">Nama IBu</label>
                <div className="relative text-white-dark">
                    <input id="MothersName" name="motherName" type="text" placeholder="Nama Ibu" className="form-input ps-10 placeholder:text-white-dark" />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconUser fill={true} />
                    </span>
                </div>
            </div>
            <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                Sign Up
            </button>
        </form>
    );
};

export default ComponentsAuthRegisterForm;
