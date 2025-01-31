import { normalStatus } from '@/constants/normal';
import { prisma } from '@/lib/prisma';
import { checkAuth } from '@/utils/auth';
import { calculateAgeInMonths } from '@/utils/helpers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        // const session: SignInResponse = await checkAuth();
        const { height, weight, headCircumference, nik } = await request.json();
        let status = [];

        const user = await prisma.member.findUnique({
            where: { nik: nik },
        });

        if (!user) {
            return NextResponse.json({ success: false, message: 'NIK not found!', error: [] }, { status: 422 });
        }

        if (user.gender.toLowerCase() === 'M') {
            const male = normalStatus.male.find((x) => x.age === calculateAgeInMonths(user.dateOfBirth));
            if (male) {
                if (male.stunting_threshold > height) {
                    status.push('Stunting');
                }
                if (male.obesity_weight < weight) {
                    status.push('Obesitas');
                }
                if (male.malnutrition_weight > weight) {
                    status.push('Gizi Buruk');
                }
            }
        }
        if (user.gender.toLowerCase() === 'F') {
            const female = normalStatus.female.find((x) => x.age === calculateAgeInMonths(user.dateOfBirth));
            if (female) {
                if (female.stunting_threshold > height) {
                    status.push('Stunting');
                }
                if (female.obesity_weight < weight) {
                    status.push('Obesitas');
                }
                if (female.malnutrition_weight > weight) {
                    status.push('Gizi Buruk');
                }
            }
        }

        const data = await prisma.checkup.create({
            data: {
                memberId: user.id,
                height,
                weight,
                headCircumference,
                age: calculateAgeInMonths(user.dateOfBirth),
                status: status.join(', '),
                checkupDate: new Date(),
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Successfully create checkup',
                data: {
                    name: user.name,
                    status: status.join(', '),
                    age: calculateAgeInMonths(user.dateOfBirth),
                    gender: user.gender,
                },
            },
            { status: 200 },
        );
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
