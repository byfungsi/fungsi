import { Kysely } from "kysely";
import { ulid } from "ulid";
import { DBType } from "../modules/databaseType";

export async function seed(db: Kysely<DBType>): Promise<void> {
	const appName = "Demo Application";

	// Check if application already exists
	const existing = await db
		.selectFrom("applications")
		.select("id")
		.where("name", "=", appName)
		.executeTakeFirst();

	if (existing) {
		console.log(`  → Application already exists: ${appName}`);
		return;
	}

	// Insert new application
	await db
		.insertInto("applications")
		.values({
			id: `app-${ulid()}`,
			name: appName,
			domain: "localhost:3000",
			callbackUrls: [
				"http://localhost:3000/auth/callback",
				"http://localhost:3000/oauth/callback",
			],
			allowedOrigins: ["http://localhost:3000", "http://localhost:8080"],
			createdAt: new Date(),
			updatedAt: new Date(),
		})
		.execute();

	console.log(`  ✓ Seeded demo application: ${appName}`);
}
