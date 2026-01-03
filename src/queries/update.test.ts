import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '../db/client';
import { usersTable, postsTable } from '../db/schema';
import { updatePost } from './update';
import { eq } from 'drizzle-orm';

describe('Update Queries', () => {
  let userId: number;
  let postId: number;

  const testUser = {
    name: 'Test User Update',
    age: 35,
    email: 'test.update@example.com',
  };

  beforeAll(async () => {
    const [user] = await db.insert(usersTable).values(testUser).returning();
    userId = user.id;

    const [post] = await db.insert(postsTable).values({
      title: 'Original Title',
      content: 'Original Content',
      userId: userId,
    }).returning();
    postId = post.id;
  });

  afterAll(async () => {
    await db.delete(usersTable).where(eq(usersTable.id, userId));
  });

  it('should update post title', async () => {
    const newTitle = 'Updated Title';
    await updatePost(postId, { title: newTitle });

    const [updatedPost] = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.id, postId));

    expect(updatedPost.title).toBe(newTitle);
    expect(updatedPost.content).toBe('Original Content'); // content should remain unchanged
  });
});
