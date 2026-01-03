import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '../db/client';
import { usersTable, postsTable } from '../db/schema';
import { getUserById, getUsersWithPostsCount, getPostsForLast24Hours } from './select';
import { eq } from 'drizzle-orm';

describe('Select Queries', () => {
  let userId: number;

  const testUser = {
    name: 'Test User Select',
    age: 30,
    email: 'test.select@example.com',
  };

  beforeAll(async () => {
    const [user] = await db.insert(usersTable).values(testUser).returning();
    userId = user.id;

    await db.insert(postsTable).values([
      {
        title: 'Select Post 1',
        content: 'Content 1',
        userId: userId,
      },
      {
        title: 'Select Post 2',
        content: 'Content 2',
        userId: userId,
      },
    ]);
  });

  afterAll(async () => {
    await db.delete(usersTable).where(eq(usersTable.id, userId));
  });

  it('should get user by id', async () => {
    const result = await getUserById(userId);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe(testUser.name);
  });

  it('should get users with posts count', async () => {
    const result = await getUsersWithPostsCount(1, 10);
    const user = result.find((u) => u.id === userId);
    
    expect(user).toBeDefined();
    expect(Number(user?.postsCount)).toBe(2);
  });

  it('should get posts for last 24 hours', async () => {
    const result = await getPostsForLast24Hours(1, 10);
    const myPosts = result.filter(p => p.title.startsWith('Select Post'));
    expect(myPosts.length).toBeGreaterThanOrEqual(2);
  });
});
