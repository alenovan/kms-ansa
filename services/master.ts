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

export const getCities = async ({ provinceId }: { provinceId?: string }) => {
    try {
        const whereClause = provinceId ? { provinceId: provinceId } : {};
        const data = await prisma.city.findMany({ where: whereClause });

        return data;
    } catch (error) {
        return null;
    }
};

export const getSubDistricts = async ({ cityId }: { cityId?: string }) => {
    try {
        const whereClause = cityId ? { cityId: cityId } : {};
        const data = await prisma.subDistrict.findMany({ where: whereClause });

        return data;
    } catch (error) {
        return null;
    }
};

export const getVillages = async ({ subDistrictId }: { subDistrictId?: string }) => {
    try {
        const whereClause = subDistrictId ? { subDistrictId: subDistrictId } : {};
        const data = await prisma.village.findMany({ where: whereClause });

        return data;
    } catch (error) {
        return null;
    }
};
