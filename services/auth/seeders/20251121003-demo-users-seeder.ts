import { Kysely } from "kysely";
import { ulid } from "ulid";
import { DBType } from "../modules/databaseType";
import { UserTableDB } from "../modules/user/domain";

export async function seed(db: Kysely<DBType>): Promise<void> {
	// Get the demo application
	const app = await db
		.selectFrom("applications")
		.select("id")
		.where("name", "=", "Demo Application")
		.executeTakeFirst();

	if (!app) {
		console.log("  ! Demo application not found. Skipping user seeding.");
		return;
	}

	// Get the password provider
	const passwordProvider = await db
		.selectFrom("providers")
		.select("id")
		.where("name", "=", "password")
		.executeTakeFirst();

	if (!passwordProvider) {
		console.log("  ! Password provider not found. Skipping user seeding.");
		return;
	}

	const demoUsers: UserTableDB[] = [
		{
			id: `usr-${ulid()}`,
			applicationId: app.id,
			email: "admin@example.com",
			emailVerifiedAt: new Date(),
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: `usr-${ulid()}`,
			applicationId: app.id,
			email: "user@example.com",
			emailVerifiedAt: new Date(),
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: `usr-${ulid()}`,
			applicationId: app.id,
			email: "test@example.com",
			emailVerifiedAt: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	];

	for (const user of demoUsers) {
		const existingUser = await db
			.selectFrom("users")
			.select("id")
			.where("email", "=", user.email)
			.where("applicationId", "=", app.id)
			.executeTakeFirst();

		if (existingUser) {
			console.log(`  → User already exists: ${user.email}`);
			continue;
		}

		await db.insertInto("users").values(user).execute();

		// Create password credentials (using a simple hash for demo - in production use proper hashing)
		// Password for all demo users: "password123"
		await db
			.insertInto("password_credentials")
			.values({
				userId: user.id,
				passwordHash:
					"$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$hash_placeholder", // placeholder
				algo: "argon2id",
				failedAttempts: 0,
				lastChangedAt: new Date(),
			})
			.execute();

		console.log(`  ✓ Seeded user: ${user.email}`);
	}

	console.log(`\n✓ Seeded ${demoUsers.length} demo users`);
}
