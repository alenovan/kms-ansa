'use server';

import { prisma } from '@/lib/prisma';
import { puskesmasSchema, PuskesmasType } from '@/lib/zod';

export const getPuskesmass = async ({ page = 1, pageSize = 10, search }: { page?: number; pageSize?: number; search?: string }) => {
    try {
        const totalCount = await prisma.puskesmas.count({
            where: search ? { name: { contains: search } } : {},
        });
        const data = await prisma.puskesmas.findMany({
            include: {
                province: true,
                city: true,
                subdistrict: true,
                village: true,
            },
            where: search ? { name: { contains: search } } : {},
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        const totalPages = Math.ceil(totalCount / pageSize);

        return {
            data,
            meta: {
                currentPage: page,
                totalPages,
                totalCount,
            },
        };
    } catch (error) {
        return {
            data: [],
            meta: { currentPage: page, totalPages: 0, totalCount: 0 },
        };
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
