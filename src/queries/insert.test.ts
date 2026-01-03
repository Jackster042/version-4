import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '../db/client';
import { usersTable, postsTable } from '../db/schema';
import { createUser, createPost } from './insert';
import { eq } from 'drizzle-orm';

describe('Insert Queries', () => {
  const testUser = {
    name: 'Test User Insert',
    age: 25,
    email: 'test.insert@example.com',
  };

  const testPost = {
    title: 'Test Post Insert',
    content: 'This is a test post content',
    userId: 0, // Will be updated after user creation
  };

  afterAll(async () => {
    // Cleanup
    await db.delete(usersTable).where(eq(usersTable.email, testUser.email));
  });

  it('should create a new user', async () => {
    await createUser(testUser);

    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, testUser.email));

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe(testUser.name);
    expect(result[0].email).toBe(testUser.email);
    
    // Save ID for post test
    testPost.userId = result[0].id;
  });

  it('should create a new post for the user', async () => {
    expect(testPost.userId).toBeGreaterThan(0); // Ensure user was created

    await createPost(testPost);

    const result = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.userId, testPost.userId));

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe(testPost.title);
    expect(result[0].content).toBe(testPost.content);
  });
});
