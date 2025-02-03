import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '../route';
import { DELETE } from '../[commentId]/route';
import { getSession } from '@auth0/nextjs-auth0/edge';

describe('Comments API', () => {
    const mockApplicationId = 'test-app-id';
    const mockCommentId = 'test-comment-id';
    

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('GET /api/applications/[id]/comments', () => {
        it('should return comments for an application', async () => {
            const request = new NextRequest('http://localhost:3000/api/applications/test-app-id/comments');
            const response = await GET(request, { params: { id: mockApplicationId } });
            
            expect(response.status).toBe(200);
            const data = await response.json();
            expect(Array.isArray(data)).toBe(true);
        });

        it('should return 401 when user is not authenticated', async () => {
            vi.mocked(getSession).mockResolvedValueOnce(null);
            
            const request = new NextRequest('http://localhost:3000/api/applications/test-app-id/comments');
            const response = await GET(request, { params: { id: mockApplicationId } });
            
            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/applications/[id]/comments', () => {
        it('should create a new comment', async () => {
            const request = new NextRequest(
                'http://localhost:3000/api/applications/test-app-id/comments',
                {
                    method: 'POST',
                    body: JSON.stringify({ comment: 'Test comment' })
                }
            );
            
            const response = await POST(request, { params: { id: mockApplicationId } });
            
            expect(response.status).toBe(201);
        });

        it('should return 400 for invalid comment data', async () => {
            const request = new NextRequest(
                'http://localhost:3000/api/applications/test-app-id/comments',
                {
                    method: 'POST',
                    body: JSON.stringify({ comment: '' }) // Empty comment should fail validation
                }
            );
            
            const response = await POST(request, { params: { id: mockApplicationId } });
            
            expect(response.status).toBe(400);
        });

        it('should return 401 when user is not authenticated', async () => {
            vi.mocked(getSession).mockResolvedValueOnce(null);
            
            const request = new NextRequest(
                'http://localhost:3000/api/applications/test-app-id/comments',
                {
                    method: 'POST',
                    body: JSON.stringify({ comment: 'Test comment' })
                }
            );
            
            const response = await POST(request, { params: { id: mockApplicationId } });
            
            expect(response.status).toBe(401);
        });
    });

    describe('DELETE /api/applications/[id]/comments/[commentId]', () => {
        it('should delete a comment', async () => {
            const request = new NextRequest(
                `http://localhost:3000/api/applications/test-app-id/comments/${mockCommentId}`
            );
            
            const response = await DELETE(request, { 
                params: { 
                    id: mockApplicationId,
                    commentId: mockCommentId 
                } 
            });
            
            expect(response.status).toBe(204);
        });

        it('should return 401 when user is not authenticated', async () => {
            vi.mocked(getSession).mockResolvedValueOnce(null);
            
            const request = new NextRequest(
                `http://localhost:3000/api/applications/test-app-id/comments/${mockCommentId}`
            );
            
            const response = await DELETE(request, { 
                params: { 
                    id: mockApplicationId,
                    commentId: mockCommentId 
                } 
            });
            
            expect(response.status).toBe(401);
        });
    });
});