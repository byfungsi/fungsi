import { Kysely, sql } from "kysely";
import { DBType } from "../modules/databaseType";

export async function up(db: Kysely<DBType>): Promise<void> {
	// 1. Create applications table
	await db.schema
		.createTable("applications")
		.addColumn("id", "varchar(36)", (col) => col.primaryKey()) // app_ULID
		.addColumn("name", "varchar", (col) => col.notNull())
		.addColumn("domain", "varchar")
		.addColumn("callbackUrls", "jsonb")
		.addColumn("allowedOrigins", "jsonb")
		.addColumn("createdAt", "timestamp", (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.addColumn("updatedAt", "timestamp", (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.execute();

	// 2. Create users table
	await db.schema
		.createTable("users")
		.addColumn("id", "varchar(36)", (col) => col.primaryKey()) // usr_ULID
		.addColumn("applicationId", "varchar(36)", (col) =>
			col.notNull().references("applications.id").onDelete("cascade"),
		)
		.addColumn("email", "varchar", (col) => col.notNull())
		.addColumn("emailVerifiedAt", "timestamp")
		.addColumn("createdAt", "timestamp", (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.addColumn("updatedAt", "timestamp", (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.execute();

	// Add unique index for tenant-scoped email
	await db.schema
		.createIndex("users_applicationId_email_unique")
		.on("users")
		.columns(["applicationId", "email"])
		.unique()
		.execute();

	// 3. Create providers table
	await db.schema
		.createTable("providers")
		.addColumn("id", "varchar(36)", (col) => col.primaryKey()) // prvdr_ULID
		.addColumn("name", "varchar", (col) => col.notNull().unique())
		.addColumn("createdAt", "timestamp", (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.addColumn("updatedAt", "timestamp", (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.execute();

	// 4. Create accounts table
	await db.schema
		.createTable("accounts")
		.addColumn("id", "varchar(36)", (col) => col.primaryKey()) // acc_ULID
		.addColumn("userId", "varchar(36)", (col) =>
			col.notNull().references("users.id").onDelete("cascade"),
		)
		.addColumn("providerId", "varchar(36)", (col) =>
			col.notNull().references("providers.id"),
		)
		.addColumn("providerUserId", "varchar", (col) => col.notNull())
		.addColumn("accessTokenEnc", "text")
		.addColumn("accessTokenExpiredAt", "timestamp")
		.addColumn("refreshTokenHash", "text")
		.addColumn("refreshTokenExpiredAt", "timestamp")
		.addColumn("idTokenEnc", "text")
		.addColumn("scope", "jsonb")
		.addColumn("createdAt", "timestamp", (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.addColumn("updatedAt", "timestamp", (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.execute();

	// Add indexes for accounts
	await db.schema
		.createIndex("accounts_providerId_providerUserId_unique")
		.on("accounts")
		.columns(["providerId", "providerUserId"])
		.unique()
		.execute();

	await db.schema
		.createIndex("accounts_userId_providerId_unique")
		.on("accounts")
		.columns(["userId", "providerId"])
		.unique()
		.execute();

	await db.schema
		.createIndex("accounts_userId_index")
		.on("accounts")
		.column("userId")
		.execute();

	await db.schema
		.createIndex("accounts_providerId_index")
		.on("accounts")
		.column("providerId")
		.execute();

	// 5. Create sessions table
	await db.schema
		.createTable("sessions")
		.addColumn("id", "varchar(36)", (col) => col.primaryKey()) // ses_ULID
		.addColumn("userId", "varchar(36)", (col) =>
			col.notNull().references("users.id").onDelete("cascade"),
		)
		.addColumn("tokenHash", "text", (col) => col.notNull().unique())
		.addColumn("expiresAt", "timestamp", (col) => col.notNull())
		.addColumn("ipAddress", "varchar")
		.addColumn("userAgent", "text")
		.addColumn("deviceId", "varchar(36)") // dev_ULID
		.addColumn("lastSeenAt", "timestamp")
		.addColumn("revokedAt", "timestamp")
		.addColumn("createdAt", "timestamp", (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.addColumn("updatedAt", "timestamp", (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.execute();

	// Add indexes for sessions
	await db.schema
		.createIndex("sessions_userId_index")
		.on("sessions")
		.column("userId")
		.execute();

	await db.schema
		.createIndex("sessions_expiresAt_index")
		.on("sessions")
		.column("expiresAt")
		.execute();

	// 6. Create password_credentials table
	await db.schema
		.createTable("password_credentials")
		.addColumn("userId", "varchar(36)", (col) =>
			col.primaryKey().references("users.id").onDelete("cascade"),
		)
		.addColumn("passwordHash", "text", (col) => col.notNull())
		.addColumn("algo", "varchar", (col) => col.notNull().defaultTo("argon2id"))
		.addColumn("lastChangedAt", "timestamp", (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.addColumn("failedAttempts", "integer", (col) => col.notNull().defaultTo(0))
		.addColumn("lockedUntil", "timestamp")
		.execute();

	// 7. Create email_verification_tokens table
	await db.schema
		.createTable("email_verification_tokens")
		.addColumn("id", "varchar(36)", (col) => col.primaryKey()) // evtok_ULID
		.addColumn("userId", "varchar(36)", (col) =>
			col.notNull().references("users.id").onDelete("cascade"),
		)
		.addColumn("tokenHash", "text", (col) => col.notNull().unique())
		.addColumn("expiresAt", "timestamp", (col) => col.notNull())
		.addColumn("usedAt", "timestamp")
		.addColumn("createdAt", "timestamp", (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.execute();

	// 8. Create password_reset_tokens table
	await db.schema
		.createTable("password_reset_tokens")
		.addColumn("id", "varchar(36)", (col) => col.primaryKey()) // prtok_ULID
		.addColumn("userId", "varchar(36)", (col) =>
			col.notNull().references("users.id").onDelete("cascade"),
		)
		.addColumn("tokenHash", "text", (col) => col.notNull().unique())
		.addColumn("expiresAt", "timestamp", (col) => col.notNull())
		.addColumn("usedAt", "timestamp")
		.addColumn("createdAt", "timestamp", (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.execute();

	// 9. Create mfa_factors table
	await db.schema
		.createTable("mfa_factors")
		.addColumn("id", "varchar(36)", (col) => col.primaryKey()) // mfa_ULID
		.addColumn("userId", "varchar(36)", (col) =>
			col.notNull().references("users.id").onDelete("cascade"),
		)
		.addColumn("type", "varchar", (col) => col.notNull())
		.addColumn("secretEnc", "text")
		.addColumn("label", "varchar")
		.addColumn("addedAt", "timestamp", (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.addColumn("disabledAt", "timestamp")
		.execute();

	// Add index for mfa_factors
	await db.schema
		.createIndex("mfa_factors_userId_index")
		.on("mfa_factors")
		.column("userId")
		.execute();

	// 10. Create auth_events table
	await db.schema
		.createTable("auth_events")
		.addColumn("id", "varchar(36)", (col) => col.primaryKey()) // aevt_ULID
		.addColumn("userId", "varchar(36)", (col) => col.references("users.id"))
		.addColumn("sessionId", "varchar(36)", (col) =>
			col.references("sessions.id"),
		)
		.addColumn("type", "varchar", (col) => col.notNull())
		.addColumn("ipAddress", "varchar")
		.addColumn("userAgent", "text")
		.addColumn("createdAt", "timestamp", (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.execute();

	// Add indexes for auth_events
	await db.schema
		.createIndex("auth_events_userId_index")
		.on("auth_events")
		.column("userId")
		.execute();

	await db.schema
		.createIndex("auth_events_sessionId_index")
		.on("auth_events")
		.column("sessionId")
		.execute();

	await db.schema
		.createIndex("auth_events_type_createdAt_index")
		.on("auth_events")
		.columns(["type", "createdAt"])
		.execute();
}

export async function down(db: Kysely<DBType>): Promise<void> {
	// Drop tables in reverse order to respect foreign key constraints
	await db.schema.dropTable("auth_events").ifExists().execute();
	await db.schema.dropTable("mfa_factors").ifExists().execute();
	await db.schema.dropTable("password_reset_tokens").ifExists().execute();
	await db.schema.dropTable("email_verification_tokens").ifExists().execute();
	await db.schema.dropTable("password_credentials").ifExists().execute();
	await db.schema.dropTable("sessions").ifExists().execute();
	await db.schema.dropTable("accounts").ifExists().execute();
	await db.schema.dropTable("providers").ifExists().execute();
	await db.schema.dropTable("users").ifExists().execute();
	await db.schema.dropTable("applications").ifExists().execute();
}
