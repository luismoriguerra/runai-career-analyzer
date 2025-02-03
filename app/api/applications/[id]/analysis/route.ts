import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/infrastructure/d1';
import { ApplicationsService } from '@/server/domain/applications';
import { getSession } from '@auth0/nextjs-auth0/edge';

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
    const actionName = searchParams.get('action_name');

    const db = getDb();
    const service = new ApplicationsService(db);
    
    // Verify application ownership
    const application = await service.getApplication(params.id, session.user.sub);
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const analyses = await service.getAnalyses(params.id, actionName);
    return NextResponse.json(analyses);
  } catch (error) {
    console.error('Error fetching analyses:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action_name, action_result, prompt_text, ai_messages } = body as { action_name: string, action_result: string, prompt_text: string, ai_messages: string };

    if (!action_name || !action_result || !prompt_text || !ai_messages) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = getDb();
    const service = new ApplicationsService(db);
    
    // Verify application ownership
    const application = await service.getApplication(params.id, session.user.sub);
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const analysis = await service.createAnalysis(params.id, {
      action_name,
      action_result,
      prompt_text,
      ai_messages,
    });

    return NextResponse.json(analysis, { status: 201 });
  } catch (error) {
    console.error('Error creating analysis:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 