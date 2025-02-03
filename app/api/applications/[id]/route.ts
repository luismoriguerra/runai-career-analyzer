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


    const db = getDb();
    const service = new ApplicationsService(db);
    const application = await service.getApplication(params.id, session.user.sub);

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, company_name } = body as { name: string, description: string, company_name: string };

    const db = getDb();
    const service = new ApplicationsService(db);
    const application = await service.updateApplication(params.id, session.user.sub, {
      name,
      description,
      company_name,
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const service = new ApplicationsService(db);
    await service.deleteApplication(params.id, session.user.sub);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 