'use server';

import { prisma } from '@/lib/prisma';
import { puskesmasSchema, PuskesmasType } from '@/lib/zod';

export const getPuskesmass = async () => {
    try {
        const data = await prisma.puskesmas.findMany({ include: { province: true, city: true, subdistrict: true, village: true } });

        return data;
    } catch (error) {
        return null;
    }
};

export const createPuskesmas = async (formData: FormData) => {
    let payload = null;
    const { name, provinceId, cityId, subDistrictId, villageId, address } = Object.fromEntries(formData) as PuskesmasType;
    payload = puskesmasSchema.safeParse({ name, provinceId, cityId, subDistrictId, villageId, address });

    if (!payload.success) {
        return {
            error: payload.error.flatten().fieldErrors,
        };
    }

    const res = await prisma.puskesmas.create({ data: { name, provinceId, cityId, subDistrictId, villageId, address: address || '' } });

    return { data: res, success: true, message: 'Success create Puskesmas' };
};

export const updatePuskesmas = async (id: string, formData: FormData) => {
    let payload = null;
    const { name, provinceId, cityId, subDistrictId, villageId, address } = Object.fromEntries(formData) as PuskesmasType;
    payload = puskesmasSchema.safeParse({ name, provinceId, cityId, subDistrictId, villageId, address });

    if (!payload.success) {
        return {
            error: payload.error.flatten().fieldErrors,
        };
    }

    const res = await prisma.puskesmas.update({ where: { id }, data: { name, provinceId, cityId, subDistrictId, villageId, address: address || '' } });

    return { data: res, success: true, message: 'Success update Puskesmas' };
};

export const deletePuskesmas = async (id: string) => {
    const res = await prisma.puskesmas.delete({ where: { id } });

    return { data: res, success: true, message: 'Success delete Puskesmas' };
};
