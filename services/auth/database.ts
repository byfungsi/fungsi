import { PgClient } from "@effect/sql-pg";
import { Config } from "effect";

export const SqlLive = PgClient.layerConfig({
	database: Config.string("DB_NAME"),
	host: Config.string("DB_HOST"),
	username: Config.string("DB_USER"),
	password: Config.redacted("DB_PASSWORD"),
	port: Config.number("DB_PORT"),
});
