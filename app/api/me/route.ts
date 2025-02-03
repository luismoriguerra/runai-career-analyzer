import { getSession } from '@auth0/nextjs-auth0/edge';

export const runtime = 'edge';

export async function GET() {
  try {
    const session = await getSession();
    return Response.json(session);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(`Internal Server Error: ${errorMessage}`, { status: 500 });
  }
} 