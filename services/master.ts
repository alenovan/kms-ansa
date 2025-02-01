'use server';
import { prisma } from '@/lib/prisma';

export const getProvinces = async () => {
    try {
        const data = await prisma.province.findMany();

        return data;
    } catch (error) {
        return null;
    }
};

export const getCities = async () => {
    try {
        const data = await prisma.city.findMany();

        return data;
    } catch (error) {
        return null;
    }
};

export const getSubDistricts = async () => {
    try {
        const data = await prisma.subDistrict.findMany();

        return data;
    } catch (error) {
        return null;
    }
};

export const getVillages = async () => {
    try {
        const data = await prisma.village.findMany();

        return data;
    } catch (error) {
        return null;
    }
};
