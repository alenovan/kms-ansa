'use server';
import { prisma } from '@/lib/prisma';
import { userSchema, UserType, userUpdateSchema, UserUpdateType } from '@/lib/zod';
import { hashPassword } from '@/utils/helpers';

export const getUsers = async ({ page = 1, pageSize = 10, search }: { page?: number; pageSize?: number; search?: string }) => {
    try {
        const totalCount = await prisma.user.count({
            where: search ? { name: { contains: search } } : {},
        });
        const data = await prisma.user.findMany({
            include: { role: true, posyandu: true, puskesmas: true },
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

export const getUser = async (id: string) => {
    try {
        const user = await prisma.user.findFirst({ where: { id }, include: { role: true } });

        return user;
    } catch (error) {
        return null;
    }
};

export const getUserByEmail = async (email: string) => {
    try {
        const user = await prisma.user.findUnique({ where: { email } });

        return user;
    } catch (error) {
        return null;
    }
};

export const createUser = async (formData: FormData) => {
    let payload = null;
    const { name, email, password, posyanduId, puskesmasId, roleId } = Object.fromEntries(formData) as UserType;
    payload = userSchema.safeParse({ name, email, password, posyanduId, puskesmasId, roleId });

    if (!payload.success) {
        return {
            error: payload.error.flatten().fieldErrors,
        };
    }

    const userData: any = {
        name,
        email,
        password: hashPassword(password),
        puskesmasId: puskesmasId || null,
        roleId,
        posyanduId: posyanduId || null,
    };

    const res = await prisma.user.create({ data: userData });

    return { data: res, success: true, message: 'Success create User' };
};

export const updateUser = async (id: string, formData: FormData) => {
    let payload = null;
    const { name, email, posyanduId, puskesmasId, roleId } = Object.fromEntries(formData) as UserUpdateType;
    payload = userUpdateSchema.safeParse({ name, email, posyanduId, puskesmasId, roleId });

    if (!payload.success) {
        return {
            error: payload.error.flatten().fieldErrors,
        };
    }

    const userData: any = {
        name,
        email,
        puskesmasId: puskesmasId || null,
        roleId,
        posyanduId: posyanduId || null,
    };

    const res = await prisma.user.update({ where: { id }, data: userData });

    return { data: res, success: true, message: 'Success update User' };
};

export const deleteUser = async (id: string) => {
    const res = await prisma.user.delete({ where: { id } });

    return { data: res, success: true, message: 'Success delete User' };
};
