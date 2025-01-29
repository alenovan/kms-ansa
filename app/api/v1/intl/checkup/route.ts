import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
        const search = url.searchParams.get('search') || '';

        const offset = (page - 1) * pageSize;

        const checkups = await prisma.checkup.findMany({
            skip: offset,
            take: pageSize,
            orderBy: {
                createdAt: 'desc',
            },
            include: {},
        });

        const totalCheckup = await prisma.checkup.count({
            where: {},
        });

        const totalPages = Math.ceil(totalCheckup / pageSize);

        return NextResponse.json(
            {
                data: checkups,
                success: true,
                message: 'Checkups retrieved successfully',
                pagination: {
                    page,
                    pageSize,
                    totalCheckup,
                    totalPages,
                },
            },
            { status: 200 },
        );
    } catch (error: any) {
        console.error('Error fetching checkups:', error);
        return NextResponse.json({ error: error.message, success: false, message: 'Server error' }, { status: 500 });
    }
}
