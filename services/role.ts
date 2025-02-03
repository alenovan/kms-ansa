'use server';

import { prisma } from '@/lib/prisma';
import { roleSchema, RoleType } from '@/lib/zod';

export const getRoles = async () => {
    try {
        const data = await prisma.role.findMany();

        return data;
    } catch (error) {
        return null;
    }
};

export const createRole = async (formData: FormData) => {
    let payload = null;
    const { name } = Object.fromEntries(formData) as RoleType;
    payload = roleSchema.safeParse({ name });

    if (!payload.success) {
        return {
            error: payload.error.flatten().fieldErrors,
        };
    }

    const res = await prisma.role.create({ data: { name } });

    return { data: res, success: true, message: 'Success create Role' };
};

export const updateRole = async (id: string, formData: FormData) => {
    let payload = null;
    const { name } = Object.fromEntries(formData) as RoleType;
    payload = roleSchema.safeParse({ name });

    if (!payload.success) {
        return {
            error: payload.error.flatten().fieldErrors,
        };
    }

    const res = await prisma.role.update({ where: { id }, data: { name } });

    return { data: res, success: true, message: 'Success update Role' };
};

export const deleteRole = async (id: string) => {
    const res = await prisma.role.delete({ where: { id } });

    return { data: res, success: true, message: 'Success delete Role' };
};
