import { Kysely } from "kysely";
import { ulid } from "ulid";
import { DBType } from "../modules/databaseType";

export async function seed(db: Kysely<DBType>): Promise<void> {
	const providers = [
		"password",
		"google",
		"github",
		"facebook",
		"apple",
		"microsoft",
		"twitter",
		"linkedin",
		"discord",
	];

	for (const providerName of providers) {
		// Check if provider already exists
		const existing = await db
			.selectFrom("providers")
			.select("id")
			.where("name", "=", providerName)
			.executeTakeFirst();

		if (existing) {
			console.log(`  → Provider already exists: ${providerName}`);
			continue;
		}

		// Insert new provider
		await db
			.insertInto("providers")
			.values({
				id: `prvdr-${ulid()}`,
				name: providerName,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.execute();

		console.log(`  ✓ Seeded provider: ${providerName}`);
	}

	console.log(`\n✓ Seeded ${providers.length} providers`);
}
