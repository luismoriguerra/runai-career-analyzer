import { NextRequest } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';
import { CommentsService } from '@/server/domain/comments';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { z } from 'zod';

export const runtime = 'edge';

const createCommentSchema = z.object({
    comment: z.string().min(1),
});

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession();
        if (!session?.user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const db = getRequestContext().env.DB;
        const commentsService = new CommentsService(db);
        console.log(JSON.stringify({ params }, null, 2));
        const comments = await commentsService.getComments(params.id);
        console.log(JSON.stringify({ comments }, null, 2));
        return Response.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        return Response.json(
            { error: 'Failed to fetch comments' },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession();
        if (!session?.user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        console.log(JSON.stringify({ body }, null, 2));
        const validatedData = createCommentSchema.parse(body);
        const db = getRequestContext().env.DB;
        const commentsService = new CommentsService(db);
        const comment = await commentsService.createComment(
            session.user.sub,
            params.id,
            validatedData.comment
        );

        return Response.json(comment, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return Response.json(
                { error: 'Invalid request data', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Error creating comment:', error);
        return Response.json(
            { error: 'Failed to create comment' },
            { status: 500 }
        );
    }
} 