import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/infrastructure/d1';
import { ApplicationsService } from '@/server/domain/applications';
import { getSession } from '@auth0/nextjs-auth0/edge';

export const runtime = 'edge';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const service = new ApplicationsService(db);
    const applications = await service.getApplications(session.user.sub);

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
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
    const { name, description, company_name } = body as { name: string, description: string, company_name: string };

    if (!name || !company_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = getDb();
    const service = new ApplicationsService(db);
    const application = await service.createApplication(session.user.sub, {
      name,
      description,
      company_name,
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 