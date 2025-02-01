'use server';

import { prisma } from '@/lib/prisma';
import { posyanduSchema, PosyanduType } from '@/lib/zod';

export const getPosyandus = async () => {
    try {
        const data = await prisma.posyandu.findMany({ include: { puskesmas: true } });

        return data;
    } catch (error) {
        return null;
    }
};

export const getPosyandu = async (id: string) => {
    try {
        const data = await prisma.posyandu.findFirst({ where: { id }, include: { puskesmas: true } });

        return data;
    } catch (error) {
        return null;
    }
};

export const createPosyandu = async (formData: FormData) => {
    let payload = null;
    const { name, puskesmasId, address } = Object.fromEntries(formData) as PosyanduType;
    payload = posyanduSchema.safeParse({ name, puskesmasId, address });

    if (!payload.success) {
        return {
            error: payload.error.flatten().fieldErrors,
        };
    }

    const res = await prisma.posyandu.create({ data: { name, puskesmasId, address: address || '' } });

    return { data: res, success: true, message: 'Success create Posyandu' };
};

export const updatePosyandu = async (id: string, formData: FormData) => {
    let payload = null;
    const { name, puskesmasId, address } = Object.fromEntries(formData) as PosyanduType;
    payload = posyanduSchema.safeParse({ name, puskesmasId, address });

    if (!payload.success) {
        return {
            error: payload.error.flatten().fieldErrors,
        };
    }

    const res = await prisma.posyandu.update({ where: { id }, data: { name, puskesmasId, address: address || '' } });

    return { data: res, success: true, message: 'Success update Posyandu' };
};

export const deletePosyandu = async (id: string) => {
    const res = await prisma.posyandu.delete({ where: { id } });

    return { data: res, success: true, message: 'Success delete Posyandu' };
};
