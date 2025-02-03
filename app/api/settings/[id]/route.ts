import { getSession } from '@auth0/nextjs-auth0/edge';
import { NextResponse } from 'next/server';
import { deleteSetting, getSetting, updateSetting } from '@/server/domain/settings';

export const runtime = 'edge';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    const userId = session?.user.sub;
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { key, value } = await req.json() as { key: string, value: string };
    
    if (!key || !value) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const existingSetting = await getSetting(params.id, userId);
    if (!existingSetting) {
      return new NextResponse('Setting not found', { status: 404 });
    }

    const setting = await updateSetting(params.id, userId, key, value);
    return NextResponse.json(setting);
  } catch (error) {
    console.error('Error updating setting:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    const userId = session?.user.sub;
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const existingSetting = await getSetting(params.id, userId);
    if (!existingSetting) {
      return new NextResponse('Setting not found', { status: 404 });
    }

    await deleteSetting(params.id, userId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting setting:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 