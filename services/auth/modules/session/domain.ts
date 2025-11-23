import { Schema } from "effect";
import { Generated } from "kysely";
import { UserIDSchema } from "../user/domain";

/* Pure Domain */

export const SessionIDSchema = Schema.String.pipe(
	Schema.filter((s) => {
		if (!s.startsWith("ses-")) {
			return "SESSION ID Schema must start with ses";
		}
		const ulidId = s.replace("ses-", "");
		if (!Schema.is(Schema.ULID)(ulidId)) {
			return "The ID doesn't contain valid ULID";
		}

		return true;
	}),
);

export const DeviceIDSchema = Schema.String.pipe(
	Schema.filter((s) => {
		if (!s.startsWith("dev-")) {
			return "DEVICE ID Schema must start with dev";
		}
		const ulidId = s.replace("dev-", "");
		if (!Schema.is(Schema.ULID)(ulidId)) {
			return "The ID doesn't contain valid ULID";
		}

		return true;
	}),
);

export class Session extends Schema.Class<Session>("Session")({
	id: SessionIDSchema,
	userId: UserIDSchema,
	tokenHash: Schema.String,
	expiresAt: Schema.DateTimeUtcFromDate,
	ipAddress: Schema.OptionFromNullishOr(Schema.String, null),
	userAgent: Schema.OptionFromNullishOr(Schema.String, null),
	deviceId: Schema.OptionFromNullishOr(DeviceIDSchema, null),
	lastSeenAt: Schema.OptionFromNullishOr(Schema.DateTimeUtcFromDate, null),
	revokedAt: Schema.OptionFromNullishOr(Schema.DateTimeUtcFromDate, null),
	createdAt: Schema.DateTimeUtcFromDate,
	updatedAt: Schema.DateTimeUtcFromDate,
}) {}

/* Encoded */

export const SessionEncoded = Schema.encodedSchema(Session);
export type SessionEncoded = typeof SessionEncoded.Type;

/* Infra */

export const SessionInsertable = SessionEncoded.pipe(
	Schema.omit("createdAt", "updatedAt"),
);
export type SessionInsertable = typeof SessionInsertable.Type;

export interface SessionTableDB extends SessionInsertable {
	createdAt: Generated<SessionEncoded["createdAt"]>;
	updatedAt: Generated<SessionEncoded["updatedAt"]>;
}
