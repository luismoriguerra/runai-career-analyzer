import { NextRequest } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';
import { CommentsService } from '@/server/domain/comments';

import { getRequestContext } from '@cloudflare/next-on-pages';


export const runtime = 'edge';

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string; commentId: string } }
) {
    try {
        const session = await getSession();
        if (!session?.user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const db = getRequestContext().env.DB;
        const commentsService = new CommentsService(db);
        await commentsService.deleteComment(
            params.commentId,
            params.id,
            session.user.sub
        );

        return new Response(null, { status: 204 });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return Response.json(
            { error: 'Failed to delete comment' },
            { status: 500 }
        );
    }
} 