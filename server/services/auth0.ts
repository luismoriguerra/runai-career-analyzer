import { getSession } from '@auth0/nextjs-auth0/edge';

export async function getUser() {
  try {
    const session = await getSession();
    const userId = session?.user.sub;
    return { userId, session };
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
} 
