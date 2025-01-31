import { SHA256 as sha256 } from 'crypto-js';

export const hashPassword = (value: string) => {
    return sha256(value).toString();
};

export const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };

    return new Date(date).toLocaleDateString('en-US', options);
};

export const generateSlug = (title: string) => {
    const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .slice(0, 50);

    return slug;
};

export const calculateAgeInMonths = (birthDate: Date) => {
    const today = new Date();

    let ageInMonths = today.getFullYear() * 12 + today.getMonth() - (birthDate.getFullYear() * 12 + birthDate.getMonth());

    if (today.getDate() < birthDate.getDate()) {
        ageInMonths--;
    }

    return ageInMonths;
};

export const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);

    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = today.getMonth() - birthDateObj.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
    }

    return age;
};
