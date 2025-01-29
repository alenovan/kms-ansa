import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Define the Gender enum in the Prisma schema (if not already defined)
enum Gender {
    M,
    F,
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
        const search = url.searchParams.get('search') || '';

        const offset = (page - 1) * pageSize;

        const members = await prisma.member.findMany({
            where: {
                name: {
                    contains: search,
                },
            },
            skip: offset,
            take: pageSize,
            orderBy: {
                createdAt: 'desc',
            },
        });

        const totalMembers = await prisma.member.count({
            where: {
                name: {
                    contains: search,
                },
            },
        });

        const totalPages = Math.ceil(totalMembers / pageSize);

        return NextResponse.json(
            {
                data: members,
                success: true,
                message: 'Members retrieved successfully',
                pagination: {
                    page,
                    pageSize,
                    totalMembers,
                    totalPages,
                },
            },
            { status: 200 },
        );
    } catch (error: any) {
        console.error('Error fetching members:', error);
        return NextResponse.json({ error: error.message, success: false, message: 'Server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { nik, name, gender, dateOfBirth, motherName } = await request.json();

        // Validate gender using the enum
        if (![Gender.M, Gender.F].includes(gender)) {
            return NextResponse.json({ success: false, message: 'Invalid gender value' }, { status: 422 });
        }

        const existingMember = await prisma.member.findUnique({
            where: { nik },
        });

        if (existingMember) {
            return NextResponse.json({ success: false, message: 'NIK already exists' }, { status: 422 });
        }

        const newMember = await prisma.member.create({
            data: {
                nik,
                name,
                dateOfBirth: new Date(dateOfBirth), // Ensure it's a valid Date object
                motherName,
            },
        });

        return NextResponse.json({ data: newMember, success: true, message: 'Member created successfully' }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating member:', error);
        return NextResponse.json({ error: error.message, success: false, message: 'Server error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        // Extract ID correctly from the URL
        const urlParts = new URL(request.url).pathname.split('/');
        const id = urlParts[urlParts.length - 1]; // Get the last segment as the ID

        if (!id) {
            return NextResponse.json({ success: false, message: 'Invalid ID' }, { status: 400 });
        }

        const { nik, name, gender, dateOfBirth, motherName } = await request.json();

        // Validate gender using the enum
        if (![Gender.M, Gender.F].includes(gender)) {
            return NextResponse.json({ success: false, message: 'Invalid gender value' }, { status: 422 });
        }

        const existingMember = await prisma.member.findUnique({
            where: { id },
        });

        if (!existingMember) {
            return NextResponse.json({ success: false, message: 'Member not found' }, { status: 404 });
        }

        const updatedMember = await prisma.member.update({
            where: { id },
            data: {
                nik,
                name,
                dateOfBirth: new Date(dateOfBirth), // Convert to Date
                motherName,
            },
        });

        return NextResponse.json({ data: updatedMember, success: true, message: 'Member updated successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('Error updating member:', error);
        return NextResponse.json({ error: error.message, success: false, message: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        // Extract ID correctly from the URL
        const urlParts = new URL(request.url).pathname.split('/');
        const id = urlParts[urlParts.length - 1]; // Get the last segment as the ID

        if (!id) {
            return NextResponse.json({ success: false, message: 'Invalid ID' }, { status: 400 });
        }

        const existingMember = await prisma.member.findUnique({
            where: { id },
        });

        if (!existingMember) {
            return NextResponse.json({ success: false, message: 'Member not found' }, { status: 404 });
        }

        await prisma.member.delete({
            where: { id },
        });

        return NextResponse.json({ success: true, message: 'Member deleted successfully' }, { status: 204 });
    } catch (error: any) {
        console.error('Error deleting member:', error);
        return NextResponse.json({ error: error.message, success: false, message: 'Server error' }, { status: 500 });
    }
}
