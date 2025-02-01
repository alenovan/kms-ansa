'use server';

import { prisma } from '@/lib/prisma';
import { memberSchema, MemberType } from '@/lib/zod';

export const getMembers = async ({ posyanduId }: { posyanduId?: string }) => {
    try {
        const data = await prisma.member.findMany({ where: { posyanduId } });

        return data;
    } catch (error) {
        return null;
    }
};

export const createMember = async (formData: FormData) => {
    let payload = null;
    const { name, nik, gender, dateOfBirth, motherName, posyanduId } = Object.fromEntries(formData) as MemberType;
    payload = memberSchema.safeParse({ name, nik, gender, dateOfBirth, motherName, posyanduId });

    if (!payload.success) {
        return {
            error: payload.error.flatten().fieldErrors,
        };
    }

    const user = await prisma.member.findFirst({ where: { nik } });
    let res;
    if (user) {
        res = await prisma.member.update({ where: { id: user.id }, data: { name, nik, gender: gender === 'M' ? 'M' : 'F', dateOfBirth: new Date(dateOfBirth), motherName, posyanduId } });
    } else {
        res = await prisma.member.create({ data: { name, nik, gender: gender === 'M' ? 'M' : 'F', dateOfBirth: new Date(dateOfBirth), motherName, posyanduId } });
    }

    return { data: res, success: true, message: 'Success create Member' };
};

export const updateMember = async (id: string, formData: FormData) => {
    let payload = null;
    const { name, nik, gender, dateOfBirth, motherName, posyanduId } = Object.fromEntries(formData) as MemberType;
    payload = memberSchema.safeParse({ name, nik, gender, dateOfBirth, motherName, posyanduId });

    if (!payload.success) {
        return {
            error: payload.error.flatten().fieldErrors,
        };
    }

    const res = await prisma.member.update({ where: { id }, data: { name, nik, gender: gender === 'M' ? 'M' : 'F', dateOfBirth: new Date(dateOfBirth), motherName, posyanduId } });

    return { data: res, success: true, message: 'Success update Member' };
};

export const deleteMember = async (id: string) => {
    const res = await prisma.member.delete({ where: { id } });

    return { data: res, success: true, message: 'Success delete Member' };
};
