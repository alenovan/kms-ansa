'use server';

import { prisma } from '@/lib/prisma';
import { medicalRecordSchema, MedicalRecordType } from '@/lib/zod';

export const getCheckups = async ({ page = 1, pageSize = 10, search }: { page?: number; pageSize?: number; search?: string }) => {
    try {
        const totalCount = await prisma.checkup.count({
            where: search ? { status: { contains: search } } : {},
        });
        const data = await prisma.checkup.findMany({
            include: {
                member: true,
                medicalRecords: true,
            },
            where: search ? { status: { contains: search } } : {},
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

export const getCheckupDashboard = async () => {
    try {
        const data = await prisma.checkup.findMany({
            include: {
                member: true,
                medicalRecords: true,
            },
        });
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getMedicalRecords = async () => {
    try {
        const data = await prisma.medicalRecord.findMany({
            include: {
                checkup: true, // Include checkup details
            },
        });
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getMedicalRecordsByCheckupId = async (checkupId: string) => {
    try {
        const data = await prisma.medicalRecord.findMany({
            where: { checkupId },
            include: {
                checkup: true,
            },
        });
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const createMedicalRecord = async (formData: FormData) => {
    let payload = null;
    const { memberId, checkupId, diagnosis, treatment } = Object.fromEntries(formData) as MedicalRecordType;
    payload = medicalRecordSchema.safeParse({ memberId, checkupId, diagnosis, treatment });

    if (!payload.success) {
        return {
            error: payload.error.flatten().fieldErrors,
        };
    }

    const res = await prisma.medicalRecord.create({
        data: { memberId, checkupId, diagnosis, treatment },
    });

    return { data: res, success: true, message: 'Success create Medical Record' };
};

export const updateMedicalRecord = async (id: string, formData: FormData) => {
    let payload = null;
    const { memberId, checkupId, diagnosis, treatment } = Object.fromEntries(formData) as MedicalRecordType;
    payload = medicalRecordSchema.safeParse({ memberId, checkupId, diagnosis, treatment });

    if (!payload.success) {
        return {
            error: payload.error.flatten().fieldErrors,
        };
    }

    const res = await prisma.medicalRecord.update({
        where: { id },
        data: { memberId, checkupId, diagnosis, treatment },
    });

    return { data: res, success: true, message: 'Success update Medical Record' };
};

export const deleteMedicalRecord = async (id: string) => {
    const res = await prisma.medicalRecord.delete({ where: { id } });

    return { data: res, success: true, message: 'Success delete Medical Record' };
};
