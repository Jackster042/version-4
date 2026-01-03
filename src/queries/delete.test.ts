import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '../db/client';
import { usersTable, postsTable } from '../db/schema';
import { deleteUser } from './delete';
import { eq } from 'drizzle-orm';

describe('Delete Queries', () => {
  let userId: number;
  let postId: number;

  const testUser = {
    name: 'Test User Delete',
    age: 40,
    email: 'test.delete@example.com',
  };

  beforeAll(async () => {
    const [user] = await db.insert(usersTable).values(testUser).returning();
    userId = user.id;

    const [post] = await db.insert(postsTable).values({
      title: 'Post to Delete',
      content: 'Content',
      userId: userId,
    }).returning();
    postId = post.id;
  });

  it('should delete user and cascade delete posts', async () => {
    await deleteUser(userId);

    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));
    expect(users).toHaveLength(0);

    const posts = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.id, postId));
    expect(posts).toHaveLength(0);
  });
});
