import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/infrastructure/d1';
import { ResumesService } from '@/server/domain/resumes';
import { getSession } from '@auth0/nextjs-auth0/edge';

export const runtime = 'edge';

export async function GET() {
    try {
        const session = await getSession();
        if (!session?.user?.sub) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const db = getDb();
        const service = new ResumesService(db);
        const resumes = await service.getResumes(session.user.sub);

        const lastResume = resumes[0];

        return NextResponse.json(lastResume);
    } catch (error) {
        console.error('Error fetching resumes:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session?.user?.sub) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }


        const body = await request.json();
        const { content } = body as { content: string };

        if (!content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const db = getDb();
        const service = new ResumesService(db);

        const existingResumes = await service.getResumes(session.user.sub);

        if (existingResumes.length > 0) {
            return NextResponse.json({ error: 'You already have a resume' }, { status: 400 });
        }

        const resume = await service.createResume(session.user.sub, content);

        return NextResponse.json(resume, { status: 201 });
    } catch (error) {
        console.error('Error creating resume:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
) {
    try {
        const session = await getSession();
        if (!session?.user?.sub) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { content } = body as { content: string };

        if (!content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const db = getDb();
        const service = new ResumesService(db);


        const resume = await service.createResume(session.user.sub, content);

        return NextResponse.json(resume);
    } catch (error) {
        console.error('Error updating resume:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}