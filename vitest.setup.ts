import { vi } from 'vitest';

// Mock auth0
vi.mock('@auth0/nextjs-auth0/edge', () => ({
    getSession: vi.fn(() => Promise.resolve({
        user: { sub: 'test-user-id', email: 'test@example.com' }
    }))
}));

// Mock Cloudflare context
vi.mock('@cloudflare/next-on-pages', () => ({
    getRequestContext: vi.fn(() => ({
        env: {
            DB: {
                prepare: vi.fn(() => ({
                    bind: vi.fn(() => ({
                        run: vi.fn(),
                        all: vi.fn(() => ({ results: [] })),
                        first: vi.fn()
                    }))
                }))
            }
        }
    }))
})); 