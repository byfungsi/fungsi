import { promises as fs } from "node:fs";
import * as path from "node:path";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

// Database configuration
const db = new Kysely({
	dialect: new PostgresDialect({
		pool: new Pool({
			host: process.env.DB_HOST || "localhost",
			port: Number(process.env.DB_PORT) || 5432,
			database: process.env.DB_NAME || "mservice_auth",
			user: process.env.DB_USER || "postgres",
			password: process.env.DB_PASSWORD || "postgres",
		}),
	}),
});

// Load and run all seeders
async function runSeeders() {
	console.log("Running database seeders...\n");

	const seedersDir = path.join(__dirname, "seeders");

	try {
		const files = await fs.readdir(seedersDir);
		const seederFiles = files
			.filter((file) => file.endsWith(".ts") || file.endsWith(".js"))
			.sort();

		if (seederFiles.length === 0) {
			console.log("No seeder files found.");
			await db.destroy();
			return;
		}

		for (const file of seederFiles) {
			const seederPath = path.join(seedersDir, file);
			console.log(`Running seeder: ${file}`);

			try {
				const seeder = await import(seederPath);

				if (typeof seeder.seed === "function") {
					await seeder.seed(db);
					console.log(`✓ Seeder "${file}" completed successfully\n`);
				} else {
					console.warn(`! Seeder "${file}" does not export a seed function\n`);
				}
			} catch (error) {
				console.error(`✗ Failed to run seeder "${file}":`, error);
				throw error;
			}
		}

		console.log("All seeders completed successfully!");
	} catch (error) {
		console.error("Failed to run seeders:", error);
		process.exit(1);
	} finally {
		await db.destroy();
	}
}

// CLI Entry Point
async function main() {
	console.log("🌱 Database Seeder\n");
	await runSeeders();
}

main().catch((error) => {
	console.error("Unexpected error:", error);
	process.exit(1);
});
