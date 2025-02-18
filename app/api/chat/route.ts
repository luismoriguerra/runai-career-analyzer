
import { streamText, CoreMessage, smoothStream } from 'ai';
import { openrouter } from '@openrouter/ai-sdk-provider';
import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';

export const runtime = 'edge';


export async function POST(req: Request) {
    const session = await getSession();
    if (!session?.user?.sub) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { messages } = await req.json() as { messages: CoreMessage[] };

    const result = streamText({
        model: openrouter('nousresearch/hermes-2-pro-llama-3-8b'),
        experimental_transform: smoothStream({ chunking: 'word' }),
        messages,
    });

    return result.toDataStreamResponse();
}