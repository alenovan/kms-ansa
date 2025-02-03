import { PrismaClient } from '@prisma/client';
import { SHA256 as sha256 } from 'crypto-js';

const prisma = new PrismaClient();
const hashPassword = (value: string) => {
    return sha256(value).toString();
};

async function main() {
    await prisma.role.createMany({ data: [{ name: 'Puskesmas' }, { name: 'Super Admin' }, { name: 'Dinas' }, { name: 'Posyandu' }] });
    const role = await prisma.role.findFirst({ where: { name: 'Super Admin' } });
    await prisma.user.upsert({
        where: { email: 'demo@demo.com' },
        update: {},
        create: {
            email: 'demo@demo.com',
            name: 'Account Demo',
            password: hashPassword('Rahasia123!'),
            roleId: role?.id,
        },
    });

    await prisma.province.createMany({
        data: [
            { id: '11', name: 'Aceh' },
            { id: '12', name: 'Sumatera Utara' },
            { id: '13', name: 'Sumatera Barat' },
            { id: '14', name: 'Riau' },
            { id: '15', name: 'Jambi' },
            { id: '16', name: 'Sumatera Selatan' },
            { id: '17', name: 'Bengkulu' },
            { id: '18', name: 'Lampung' },
            { id: '19', name: 'Kepulauan Bangka Belitung' },
            { id: '21', name: 'Kepulauan Riau' },
            { id: '31', name: 'DKI Jakarta' },
            { id: '32', name: 'Jawa Barat' },
            { id: '33', name: 'Jawa Tengah' },
            { id: '34', name: 'DI Yogyakarta' },
            { id: '35', name: 'Jawa Timur' },
            { id: '36', name: 'Banten' },
            { id: '51', name: 'Bali' },
            { id: '52', name: 'Nusa Tenggara Barat' },
            { id: '53', name: 'Nusa Tenggara Timur' },
            { id: '61', name: 'Kalimantan Barat' },
            { id: '62', name: 'Kalimantan Tengah' },
            { id: '63', name: 'Kalimantan Selatan' },
            { id: '64', name: 'Kalimantan Timur' },
            { id: '65', name: 'Kalimantan Utara' },
            { id: '71', name: 'Sulawesi Utara' },
            { id: '72', name: 'Sulawesi Tengah' },
            { id: '73', name: 'Sulawesi Selatan' },
            { id: '74', name: 'Sulawesi Tenggara' },
            { id: '75', name: 'Gorontalo' },
            { id: '76', name: 'Sulawesi Barat' },
            { id: '81', name: 'Maluku' },
            { id: '82', name: 'Maluku Utara' },
            { id: '91', name: 'Papua Barat' },
            { id: '92', name: 'Papua' },
        ],
    });

    await prisma.city.createMany({
        data: [
            { provinceId: '35', id: '3501', name: 'Kota Surabaya' },
            { provinceId: '35', id: '3502', name: 'Kota Malang' },
            { provinceId: '35', id: '3503', name: 'Kota Kediri' },
            { provinceId: '35', id: '3504', name: 'Kota Probolinggo' },
            { provinceId: '35', id: '3505', name: 'Kota Blitar' },
            { provinceId: '35', id: '3506', name: 'Kota Mojokerto' },
            { provinceId: '35', id: '3507', name: 'Kota Pasuruan' },
            { provinceId: '35', id: '3508', name: 'Kota Sidoarjo' },
            { provinceId: '35', id: '3509', name: 'Kota Madiun' },
            { provinceId: '35', id: '3510', name: 'Kota Banyuwangi' },
            { provinceId: '35', id: '3511', name: 'Kota Jember' },
            { provinceId: '35', id: '3512', name: 'Kota Lumajang' },
            { provinceId: '35', id: '3513', name: 'Kota Ngawi' },
            { provinceId: '35', id: '3514', name: 'Kota Tuban' },
            { provinceId: '35', id: '3515', name: 'Kota Tegal' },
            { provinceId: '35', id: '3516', name: 'Kota Situbondo' },
            { provinceId: '35', id: '3517', name: 'Kota Bangkalan' },
            { provinceId: '35', id: '3518', name: 'Kota Sampang' },
            { provinceId: '35', id: '3519', name: 'Kota Pamekasan' },
            { provinceId: '35', id: '3520', name: 'Kota Sumenep' },
        ],
    });

    await prisma.subDistrict.createMany({
        data: [
            {
                provinceId: '35',
                cityId: '3505',
                id: '350501',
                name: 'Ajung',
            },
            {
                provinceId: '35',
                cityId: '3505',
                id: '350502',
                name: 'Ambulu',
            },
            {
                provinceId: '35',
                cityId: '3505',
                id: '350503',
                name: 'Arjasa',
            },
            {
                provinceId: '35',
                cityId: '3505',
                id: '350504',
                name: 'Balung',
            },
            {
                provinceId: '35',
                cityId: '3505',
                id: '350505',
                name: 'Bangsalsari',
            },
            {
                provinceId: '35',
                cityId: '3505',
                id: '350506',
                name: 'Gelanggang',
            },
            {
                provinceId: '35',
                cityId: '3505',
                id: '350507',
                name: 'Kencong',
            },
            {
                provinceId: '35',
                cityId: '3505',
                id: '350508',
                name: 'Krasak',
            },
            {
                provinceId: '35',
                cityId: '3505',
                id: '350509',
                name: 'Panti',
            },
            {
                provinceId: '35',
                cityId: '3505',
                id: '350510',
                name: 'Sumberbaru',
            },
            {
                provinceId: '35',
                cityId: '3505',
                id: '350511',
                name: 'Sukowono',
            },
            {
                provinceId: '35',
                cityId: '3505',
                id: '350512',
                name: 'Umbulsari',
            },
            {
                provinceId: '35',
                cityId: '3505',
                id: '350513',
                name: 'Wuluhan',
            },
        ],
    });

    await prisma.village.createMany({
        data: [
            {
                provinceId: '35',
                cityId: '3505',
                subDistrictId: '350501',
                id: '350501001',
                name: 'Ajung',
            },
            {
                provinceId: '35',
                cityId: '3505',
                subDistrictId: '350501',
                id: '350501002',
                name: 'Karangrejo',
            },
            {
                provinceId: '35',
                cityId: '3505',
                subDistrictId: '350501',
                id: '350501003',
                name: 'Gambiran',
            },
            {
                provinceId: '35',
                cityId: '3505',
                subDistrictId: '350501',
                id: '350501004',
                name: 'Tegalrejo',
            },
            {
                provinceId: '35',
                cityId: '3505',
                subDistrictId: '350501',
                id: '350501005',
                name: 'Sumberrejo',
            },
        ],
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
