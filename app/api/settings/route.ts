import { getSession } from '@auth0/nextjs-auth0/edge';
import { NextResponse } from 'next/server';
import { createSetting, getSettings } from '@/server/domain/settings';

export const runtime = 'edge';

export async function GET() {
  try {
    const session = await getSession();
    const userId = session?.user.sub;
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const settings = await getSettings(userId);
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
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

    const setting = await createSetting(userId, key, value);
    return NextResponse.json(setting);
  } catch (error) {
    console.error('Error creating setting:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 