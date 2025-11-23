import { Schema } from "effect";
import { Generated } from "kysely";
import { ApplicationIDSchema } from "../application/domain";

/* Pure Domain */

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

/* Encoded */

export const UserEncoded = Schema.encodedSchema(User);
export type UserEncoded = typeof UserEncoded.Type;

/* Infra */

export const UserInsertable = UserEncoded.pipe(
	Schema.omit("createdAt", "updatedAt"),
);
export type UserInsertable = typeof UserInsertable.Type;

export interface UserTableDB extends UserInsertable {
	createdAt: Generated<UserEncoded["createdAt"]>;
	updatedAt: Generated<UserEncoded["updatedAt"]>;
}

/* DTO */

export const UserArrayResponse = Schema.Array(
	Schema.Struct(User.fields).omit("applicationId"),
);
