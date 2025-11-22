import { Schema } from "effect";
import { ApplicationIDSchema } from "../application/domain";

const Email = Schema.String.pipe(Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/));

export const UserIDSchema = Schema.String.pipe(
	Schema.filter((s) => {
		if (!s.startsWith("usr-")) {
			return "USER ID Schema must start with usr";
		}
		const ulidId = s.replace("usr-", "");
		if (!Schema.is(Schema.ULID)(ulidId)) {
			return "The ID doesn't contain valid ULID";
		}

		return true;
	}),
);

export class User extends Schema.Class<User>("User")({
	id: UserIDSchema,
	email: Email,
	applicationId: ApplicationIDSchema,
	emailVerifiedAt: Schema.OptionFromNullishOr(Schema.DateFromSelf, null),
	createdAt: Schema.DateFromSelf,
	updatedAt: Schema.DateFromSelf,
}) {}

export const UserTableDB = Schema.encodedSchema(User);
export type UserTableDB = typeof UserTableDB.Type;

export const userFromUnknown = Schema.decodeUnknown(User);
export const userToDb = Schema.encode(User);
export const toUser = Schema.decode(User);

export const UserArrayResponse = Schema.Array(
	Schema.Struct(User.fields).omit("applicationId"),
);
