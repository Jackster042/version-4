import { db } from "./client";
import { usersTable, postsTable } from "./schema";

async function main() {
  console.log("Seeding database...");

  // Create Users
  const users = await db
    .insert(usersTable)
    .values([
      {
        name: "Alice Johnson",
        age: 28,
        email: "alice@example.com",
      },
      {
        name: "Bob Smith",
        age: 34,
        email: "bob@example.com",
      },
      {
        name: "Charlie Brown",
        age: 22,
        email: "charlie@example.com",
      },
    ])
    .returning();

  console.log(`Created ${users.length} users`);

  // Create Posts
  const postsData = [
    {
      title: "First Post",
      content: "Hello World from Alice!",
      userId: users[0].id,
    },
    {
      title: "Drizzle is cool",
      content: "I'm learning Drizzle ORM",
      userId: users[0].id,
    },
    {
      title: "Bob's Thoughts",
      content: "Database seeding is useful",
      userId: users[1].id,
    },
    {
      title: "Another Day",
      content: "Just another post",
      userId: users[2].id,
    },
  ];

  const posts = await db.insert(postsTable).values(postsData).returning();

  console.log(`Created ${posts.length} posts`);
  console.log("Seeding complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed");
  console.error(err);
  process.exit(1);
});
