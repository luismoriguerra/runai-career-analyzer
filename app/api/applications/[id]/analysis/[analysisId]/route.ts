import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/infrastructure/d1';
import { ApplicationsService } from '@/server/domain/applications';
import { getSession } from '@auth0/nextjs-auth0/edge';

export const runtime = 'edge';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; analysisId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action_name, action_result, prompt_text, ai_messages } = body as { action_name: string, action_result: string, prompt_text: string, ai_messages: string };

    const db = getDb();
    const service = new ApplicationsService(db);

    // Verify application ownership
    const application = await service.getApplication(params.id, session.user.sub);
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const analysis = await service.updateAnalysis(params.analysisId, params.id, {
      action_name,
      action_result,
      prompt_text,
      ai_messages,
    });

    if (!analysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error updating analysis:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; analysisId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const service = new ApplicationsService(db);

    // Verify application ownership
    const application = await service.getApplication(params.id, session.user.sub);
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    await service.deleteAnalysis(params.analysisId, params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting analysis:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 