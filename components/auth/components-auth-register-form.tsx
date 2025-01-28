'use client';

import IconUser from '@/components/icon/icon-user';
import { IRootState } from '@/store';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useSelector } from 'react-redux';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import IconMenuCalendar from '../icon/menu/icon-menu-calendar';
import IconMenuDocumentation from '../icon/menu/icon-menu-documentation';

const ComponentsAuthRegisterForm = () => {
    const router = useRouter();
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const submitForm = (e: any) => {
        e.preventDefault();
        router.push('/');
    };
    return (
        <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
            <div>
                <label htmlFor="NIK">NIK</label>
                <div className="relative text-white-dark">
                    <input id="NIK" type="text" placeholder="Enter NIK" className="form-input ps-10 placeholder:text-white-dark" />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconMenuDocumentation />
                    </span>
                </div>
            </div>
            <div>
                <label htmlFor="Name">Name</label>
                <div className="relative text-white-dark">
                    <input id="Name" type="text" placeholder="Enter Name" className="form-input ps-10 placeholder:text-white-dark" />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconUser fill={true} />
                    </span>
                </div>
            </div>
            <div>
                <label htmlFor="BirthDay">Birth Day</label>
                <div className="relative text-white-dark">
                    <Flatpickr
                        options={{ dateFormat: 'Y-m-d', position: isRtl ? 'auto right' : 'auto left' }}
                        className="form-input ps-10 placeholder:text-white-dark"
                        placeholder="Select Birth Date"
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconMenuCalendar />
                    </span>
                </div>
            </div>
            <div>
                <label htmlFor="MothersName">Mother&apos;s Name</label>
                <div className="relative text-white-dark">
                    <input id="MothersName" type="text" placeholder="Enter Mother's Name" className="form-input ps-10 placeholder:text-white-dark" />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconUser fill={true} />
                    </span>
                </div>
            </div>
            <div>
                <label className="flex cursor-pointer items-center">
                    <input type="checkbox" className="form-checkbox bg-white dark:bg-black" />
                    <span className="text-white-dark">Subscribe to weekly newsletter</span>
                </label>
            </div>
            <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                Sign Up
            </button>
        </form>
    );
};

export default ComponentsAuthRegisterForm;
