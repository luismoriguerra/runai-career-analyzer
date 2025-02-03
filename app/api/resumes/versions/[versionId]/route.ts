import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/infrastructure/d1';
import { ResumesService } from '@/server/domain/resumes';
import { ResumeVersionService } from '@/server/domain/services/resume-version.service';
import { getSession } from '@auth0/nextjs-auth0/edge';

export const runtime = 'edge';

interface RegenerateRequest {
  regenerate: boolean;
}

interface UpdateRequest {
  content: string;
  title?: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { versionId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const resumesService = new ResumesService(db);
    const versionService = new ResumeVersionService(resumesService);

    // Verify resume ownership
    const getFirstResume = await resumesService.getResumes(session.user.sub);
    const firstResume = getFirstResume[0];
    const resume = await resumesService.getResume(firstResume.id, session.user.sub);
    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    // Check if this is a paginated list request
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    if (params.versionId === 'list') {
      const paginatedVersions = await versionService.getVersionsPaginated(firstResume.id, page, limit);
      return NextResponse.json(paginatedVersions);
    }

    // Single version fetch
    const version = await versionService.getVersion(params.versionId, firstResume.id);
    if (!version) {
      return NextResponse.json({ error: 'Resume version not found' }, { status: 404 });
    }

    return NextResponse.json(version);
  } catch (error) {
    console.error('Error fetching resume version:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { versionId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json() as RegenerateRequest;
    const { regenerate } = body;

    if (!regenerate) {
      return NextResponse.json({ error: 'Missing regenerate flag' }, { status: 400 });
    }

    const db = getDb();
    const resumesService = new ResumesService(db);
    const versionService = new ResumeVersionService(resumesService);

    // Verify resume ownership
    const getFirstResume = await resumesService.getResumes(session.user.sub);
    const firstResume = getFirstResume[0];
    const resume = await resumesService.getResume(firstResume.id, session.user.sub);
    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const version = await versionService.getVersion(params.versionId, firstResume.id);
    if (!version) {
      return NextResponse.json({ error: 'Resume version not found' }, { status: 404 });
    }

    const updatedVersion = await versionService.regenerateVersion(version);
    return NextResponse.json(updatedVersion);
  } catch (error) {
    console.error('Error regenerating resume version:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { versionId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json() as UpdateRequest;
    const { content, title } = body;

    if (!content) {
      return NextResponse.json({ error: 'Missing content' }, { status: 400 });
    }

    const db = getDb();
    const resumesService = new ResumesService(db);
    const versionService = new ResumeVersionService(resumesService);

    // Verify resume ownership
    const getFirstResume = await resumesService.getResumes(session.user.sub);
    const firstResume = getFirstResume[0];
    const resume = await resumesService.getResume(firstResume.id, session.user.sub);
    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const version = await versionService.getVersion(params.versionId, firstResume.id);
    if (!version) {
      return NextResponse.json({ error: 'Resume version not found' }, { status: 404 });
    }

    const updatedVersion = await versionService.updateVersion(params.versionId, firstResume.id, {
      content_generated: content,
      ...(title && { title }),
    });

    return NextResponse.json(updatedVersion);
  } catch (error) {
    console.error('Error updating resume version:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { versionId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const resumesService = new ResumesService(db);
    const versionService = new ResumeVersionService(resumesService);

    // Verify resume ownership
    const getFirstResume = await resumesService.getResumes(session.user.sub);
    const firstResume = getFirstResume[0];
    const resume = await resumesService.getResume(firstResume.id, session.user.sub);
    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const version = await versionService.getVersion(params.versionId, firstResume.id);
    if (!version) {
      return NextResponse.json({ error: 'Resume version not found' }, { status: 404 });
    }

    await versionService.deleteVersion(params.versionId, firstResume.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting resume version:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 