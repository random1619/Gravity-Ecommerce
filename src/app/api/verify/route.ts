import { NextResponse } from 'next/server';
import { isValidEmail, sanitizeString } from '@/lib/security';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Validate inputs
        if (!data.email || !isValidEmail(data.email)) {
            return NextResponse.json(
                { success: false, error: 'Invalid email address' },
                { status: 400 }
            );
        }

        if (!data.studentId || typeof data.studentId !== 'string') {
            return NextResponse.json(
                { success: false, error: 'Student ID required' },
                { status: 400 }
            );
        }

        // Sanitize inputs
        const sanitizedEmail = sanitizeString(data.email, 254);
        const sanitizedStudentId = sanitizeString(data.studentId, 50);
        const sanitizedName = data.name ? sanitizeString(data.name, 100) : undefined;

        const referenceId = `${sanitizedStudentId.slice(-4)}-${sanitizedEmail.split('@')[0]}`;

        // Simulated verification logic
        // In production, never log sensitive user data
        // console.log('Verifying student');

        // In a real app, we would:
        // 1. Verify the student ID against a database
        // 2. Check if document is valid
        // 3. Create a verified user session

        return NextResponse.json({
            success: true,
            message: 'Student status verified!',
            promoCode: 'STUDENT20',
            referenceId,
            name: sanitizedName ?? undefined,
        });
    } catch (error) {
        console.error('Verify API error:', error);
        return NextResponse.json(
            { success: false, error: 'Verification failed' },
            { status: 500 }
        );
    }
}
