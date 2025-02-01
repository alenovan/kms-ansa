'use server';
import { prisma } from '@/lib/prisma';
export const getUsers = async () => {
    try {
        const user = await prisma.user.findMany();

        return user;
    } catch (error) {
        return null;
    }
};

export const getUser = async (id: string) => {
    try {
        const user = await prisma.user.findFirst({ where: { id } });

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

export const createUser = async (name: string, email: string, password: string, image?: string) => {};
