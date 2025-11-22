import { promises as fs } from "node:fs";
import * as path from "node:path";
import {
	FileMigrationProvider,
	Kysely,
	Migrator,
	PostgresDialect,
} from "kysely";
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

// Migration provider
const migrator = new Migrator({
	db,
	provider: new FileMigrationProvider({
		fs,
		path,
		migrationFolder: path.join(__dirname, "migrations"),
	}),
});

// CLI Commands
async function migrateToLatest() {
	console.log("Running migrations to latest...");
	const { error, results } = await migrator.migrateToLatest();

	results?.forEach((it) => {
		if (it.status === "Success") {
			console.log(
				`� Migration "${it.migrationName}" was executed successfully`,
			);
		} else if (it.status === "Error") {
			console.error(`� Failed to execute migration "${it.migrationName}"`);
		}
	});

	if (error) {
		console.error("Failed to migrate:");
		console.error(error);
		process.exit(1);
	}

	console.log("All migrations completed successfully!");
	await db.destroy();
}

async function migrateUp() {
	console.log("Running next migration...");
	const { error, results } = await migrator.migrateUp();

	results?.forEach((it) => {
		if (it.status === "Success") {
			console.log(
				`� Migration "${it.migrationName}" was executed successfully`,
			);
		} else if (it.status === "Error") {
			console.error(`� Failed to execute migration "${it.migrationName}"`);
		}
	});

	if (error) {
		console.error("Failed to migrate:");
		console.error(error);
		process.exit(1);
	}

	console.log("Migration completed successfully!");
	await db.destroy();
}

async function migrateDown() {
	console.log("Rolling back last migration...");
	const { error, results } = await migrator.migrateDown();

	results?.forEach((it) => {
		if (it.status === "Success") {
			console.log(
				`� Migration "${it.migrationName}" was rolled back successfully`,
			);
		} else if (it.status === "Error") {
			console.error(`� Failed to rollback migration "${it.migrationName}"`);
		}
	});

	if (error) {
		console.error("Failed to rollback:");
		console.error(error);
		process.exit(1);
	}

	console.log("Rollback completed successfully!");
	await db.destroy();
}

async function migrateReset() {
	console.log("Resetting database (rolling back all migrations)...");

	// Migrate down to beginning (no migrations applied)
	const { error, results } = await migrator.migrateTo("NO_MIGRATIONS" as any);

	results?.forEach((it) => {
		if (it.status === "Success") {
			console.log(
				`� Migration "${it.migrationName}" was rolled back successfully`,
			);
		} else if (it.status === "Error") {
			console.error(`� Failed to rollback migration "${it.migrationName}"`);
		}
	});

	if (error) {
		console.error("Failed to reset:");
		console.error(error);
		process.exit(1);
	}

	console.log("Database reset completed successfully!");
	await db.destroy();
}

async function showStatus() {
	console.log("Checking migration status...\n");
	const migrations = await migrator.getMigrations();

	if (migrations.length === 0) {
		console.log("No migrations found.");
		await db.destroy();
		return;
	}

	console.log("Migration Status:");
	console.log("�".repeat(80));

	for (const migration of migrations) {
		const status = migration.executedAt
			? `� Executed at ${migration.executedAt.toISOString()}`
			: "� Pending";
		console.log(`${migration.name.padEnd(50)} ${status}`);
	}

	console.log("�".repeat(80));
	await db.destroy();
}

// CLI Entry Point
const command = process.argv[2];

async function main() {
	console.log("=?�  Database Migrator\n");

	switch (command) {
		case "up":
			await migrateUp();
			break;
		case "down":
			await migrateDown();
			break;
		case "latest":
			await migrateToLatest();
			break;
		case "reset":
			await migrateReset();
			break;
		case "status":
			await showStatus();
			break;
		default:
			console.log("Usage: bun migrator.ts <command>");
			console.log("\nCommands:");
			console.log("  up      - Run the next pending migration");
			console.log("  down    - Rollback the last executed migration");
			console.log("  latest  - Run all pending migrations");
			console.log("  reset   - Rollback all migrations");
			console.log("  status  - Show migration status");
			console.log("\nEnvironment variables:");
			console.log("  DB_HOST     - Database host (default: localhost)");
			console.log("  DB_PORT     - Database port (default: 5432)");
			console.log("  DB_NAME     - Database name (default: mservice_auth)");
			console.log("  DB_USER     - Database user (default: postgres)");
			console.log("  DB_PASSWORD - Database password (default: postgres)");
			process.exit(1);
	}
}

main().catch((error) => {
	console.error("Unexpected error:", error);
	process.exit(1);
});
