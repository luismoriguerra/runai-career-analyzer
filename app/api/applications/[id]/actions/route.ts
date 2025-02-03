import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/infrastructure/d1';
import { ApplicationsService } from '@/server/domain/applications';
import { getSession } from '@auth0/nextjs-auth0/edge';
import { ApplicationAnalysisService } from '@/server/domain/services/application-analysis.service';
import { ActionName } from '@/server/domain/types/application-actions';
import { ResumesService } from '@/server/domain/resumes';

export const runtime = 'edge';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession();
        if (!session?.user?.sub) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const actionName = searchParams.get('action_name') as ActionName;
        const rebuild = searchParams.get('rebuild') === 'true';

        if (!actionName) {
            return NextResponse.json({ error: 'Action name is required' }, { status: 400 });
        }

        const db = getDb();
        const applicationsService = new ApplicationsService(db);
        const resumesService = new ResumesService(db);
        const analysisService = new ApplicationAnalysisService(applicationsService, resumesService);

        try {
            const analysis = await analysisService.getAnalysis(
                params.id,
                actionName,
                session.user.sub,
                rebuild
            );
            return NextResponse.json(analysis);
        } catch (error) {
            if (error instanceof Error && error.message === 'Application not found') {
                return NextResponse.json({ error: 'Application not found' }, { status: 404 });
            }
            throw error;
        }
    } catch (error) {
        console.error('Error processing action:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}