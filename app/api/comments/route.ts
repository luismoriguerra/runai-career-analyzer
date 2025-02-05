import { CommentsService } from '@/server/domain/comments';
import { getSession } from '@auth0/nextjs-auth0/edge';
import { getDb } from '@/server/infrastructure/d1';
export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        // Validate pagination parameters
        if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 100) {
            return Response.json(
                { error: 'Invalid pagination parameters' },
                { status: 400 }
            );
        }

        const db = getDb();
        const commentsService = new CommentsService(db);
        const comments = await commentsService.getLastUserComments(session.user.sub, page, limit);
        return Response.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        return Response.json(
            { error: 'Failed to fetch comments' },
            { status: 500 }
        );
    }
}