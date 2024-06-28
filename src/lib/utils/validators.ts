// src/lib/validators.ts

export function validateStudentId(studentId: string): boolean {
    const studentIdRegex = /^\d+$/;
    return studentIdRegex.test(studentId);
}

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validateUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z\s]{3,50}$/;
    return usernameRegex.test(username);
}

export function validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,20}$/;
    return passwordRegex.test(password);
}
