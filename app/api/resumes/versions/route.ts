import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/infrastructure/d1';
import { ResumesService } from '@/server/domain/resumes';
import { getSession } from '@auth0/nextjs-auth0/edge';
import { modelByCategory } from '@/server/infrastructure/ai/llm-providers';
import { generateText } from 'ai';

export const runtime = 'edge';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const service = new ResumesService(db);

    const getFirstResume = await service.getResumes(session.user.sub);
    const firstResume = getFirstResume[0];

    // Verify resume ownership
    const resume = await service.getResume(firstResume.id, session.user.sub);
    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const versions = await service.getResumeVersions(firstResume.id);
    return NextResponse.json(versions);
  } catch (error) {
    console.error('Error fetching resume versions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
) {
  try {
    const session = await getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { prompt } = body as { prompt: string };


    const db = getDb();
    const service = new ResumesService(db);

    // Verify resume ownership
    const getFirstResume = await service.getResumes(session.user.sub);
    const firstResume = getFirstResume[0];
    const resume = await service.getResume(firstResume.id, session.user.sub);
    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const rebuildId = new Date().getTime();


    const systemTemplate = `
        LLM Rules: You are an AI assistant that can help to improve a resume.
You are given a resume and a prompt.
You must respond to the prompt based on the resume. don't explain yourself. only return the response.
<resume>${resume.content}</resume>
<rebuildId>${rebuildId}</rebuildId>
    `;


    const { text, usage } = await generateText({
      model: modelByCategory.fastHermes2Pro8b,
      system: systemTemplate,
      maxTokens: 8000,
      prompt,
    });

    console.log(JSON.stringify({ text, usage }, null, 2));

    const version = await service.createResumeVersion(firstResume.id, {
      prompt,
      ai_messages: JSON.stringify(usage),
      title: prompt.split('\n')[0],
      content_previous: resume.content,
      content_generated: text,
      usages: JSON.stringify(usage),
    });

    console.log(JSON.stringify(version, null, 2));

    return NextResponse.json(version, { status: 201 });
  } catch (error) {
    console.error('Error creating resume version:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 