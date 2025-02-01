import { object, string, z } from 'zod';

export const signInSchema = object({
    email: string({ required_error: 'Email is required' }).min(1, 'Email is required').email('Invalid email'),
    password: string({ required_error: 'Password is required' }).min(1, 'Password is required').min(8, 'Password must be more than 8 characters').max(32, 'Password must be less than 32 characters'),
});

export const puskesmasSchema = object({
    name: string({ required_error: 'Name is required' }).trim().min(1, 'Name is required'),
    provinceId: string({ required_error: 'Province is required' }).trim().min(1, 'Province is required'),
    cityId: string({ required_error: 'City is required' }).trim().min(1, 'City is required'),
    subDistrictId: string({ required_error: 'Sub District is required' }).trim().min(1, 'Sub District is required'),
    villageId: string({ required_error: 'Village is required' }).trim().min(1, 'Village is required'),
    address: string({ required_error: 'Address is required' }).trim().optional(),
});

export const posyanduSchema = object({
    name: string({ required_error: 'Name is required' }).trim().min(1, 'Name is required'),
    puskesmasId: string({ required_error: 'Puskesmas is required' }).trim().min(1, 'Puskesmas is required'),
    address: string({ required_error: 'Address is required' }).trim().optional(),
});

export const memberSchema = object({
    nik: string({ required_error: 'NIK is required' }).trim().min(1, 'NIK is required'),
    name: string({ required_error: 'Name is required' }).trim().min(1, 'Name is required'),
    gender: string({ required_error: 'Gender is required' }).trim().min(1, 'Gender is required'),
    dateOfBirth: string({ required_error: 'Date Of Birth is required' }).trim().min(1, 'Date Of Birth is required'),
    motherName: string({ required_error: 'Mother Name is required' }).trim().min(1, 'Mother Name is required'),
    posyanduId: string({ required_error: 'Posyandu is required' }).trim().min(1, 'Posyandu is required'),
});

export const medicalRecordSchema = z.object({
    memberId: z.string().min(1, 'Member ID is required'),
    checkupId: z.string().min(1, 'Checkup ID is required'),
    diagnosis: z.string().min(1, 'Diagnosis is required'),
    treatment: z.string().min(1, 'Treatment is required'),
});

export type MedicalRecordType = z.infer<typeof medicalRecordSchema>;
export type SignInType = z.infer<typeof signInSchema>;
export type PuskesmasType = z.infer<typeof puskesmasSchema>;
export type PosyanduType = z.infer<typeof posyanduSchema>;
export type MemberType = z.infer<typeof memberSchema>;
