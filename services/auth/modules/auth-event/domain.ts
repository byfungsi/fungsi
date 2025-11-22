import { Schema } from "effect";
import { SessionIDSchema } from "../session/domain";
import { UserIDSchema } from "../user/domain";

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

export const AuthEventTableDB = Schema.encodedSchema(AuthEvent);
export type AuthEventTableDB = typeof AuthEventTableDB.Type;

export const authEventFromUnknown = Schema.decodeUnknown(AuthEvent);
export const authEventToDb = Schema.encode(AuthEvent);
export const toAuthEvent = Schema.decode(AuthEvent);
