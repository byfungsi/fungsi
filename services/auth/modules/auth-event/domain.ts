import { Schema } from "effect";
import { Generated } from "kysely";
import { SessionIDSchema } from "../session/domain";
import { UserIDSchema } from "../user/domain";

/* Pure Domain */

export const AuthEventIDSchema = Schema.String.pipe(
	Schema.filter((s) => {
		if (!s.startsWith("aevt-")) {
			return "AUTH EVENT ID Schema must start with aevt";
		}
		const ulidId = s.replace("aevt-", "");
		if (!Schema.is(Schema.ULID)(ulidId)) {
			return "The ID doesn't contain valid ULID";
		}

		return true;
	}),
);

export class AuthEvent extends Schema.Class<AuthEvent>("AuthEvent")({
	id: AuthEventIDSchema,
	userId: Schema.OptionFromNullishOr(UserIDSchema, null),
	sessionId: Schema.OptionFromNullishOr(SessionIDSchema, null),
	type: Schema.String,
	ipAddress: Schema.OptionFromNullishOr(Schema.String, null),
	userAgent: Schema.OptionFromNullishOr(Schema.String, null),
	createdAt: Schema.DateTimeUtcFromDate,
}) {}

/* Encoded */

export const AuthEventEncoded = Schema.encodedSchema(AuthEvent);
export type AuthEventEncoded = typeof AuthEventEncoded.Type;

/* Infra */

export const AuthEventInsertable = AuthEventEncoded.pipe(
	Schema.omit("createdAt"),
);
export type AuthEventInsertable = typeof AuthEventInsertable.Type;

export interface AuthEventTableDB extends AuthEventInsertable {
	createdAt: Generated<AuthEventEncoded["createdAt"]>;
}
