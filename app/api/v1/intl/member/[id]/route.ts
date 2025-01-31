import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
    try {
        // Extract ID correctly from the URL
        const urlParts = new URL(request.url).pathname.split('/');
        const id = urlParts[urlParts.length - 1]; // Get the last segment as the ID

        if (!id) {
            return NextResponse.json({ success: false, message: 'Invalid ID' }, { status: 400 });
        }

        const { nik, name, gender, dateOfBirth, motherName } = await request.json();

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
                gender,
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

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const member = await prisma.member.findUnique({
            where: {
                nik: id, // Fetch member by ID
            },
        });

        if (!member) {
            return NextResponse.json({ success: false, message: 'Member not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: member, message: 'Member retrieved successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching member:', error);
        return NextResponse.json({ error: error.message, success: false, message: 'Server error' }, { status: 500 });
    }
}
