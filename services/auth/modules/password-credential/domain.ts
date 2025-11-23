import { Schema } from "effect";
import { Generated } from "kysely";
import { UserIDSchema } from "../user/domain";

/* Pure Domain */

export class PasswordCredential extends Schema.Class<PasswordCredential>(
	"PasswordCredential",
)({
	userId: UserIDSchema,
	passwordHash: Schema.String,
	algo: Schema.String,
	lastChangedAt: Schema.DateTimeUtcFromDate,
	failedAttempts: Schema.Number,
	lockedUntil: Schema.OptionFromNullishOr(Schema.DateTimeUtcFromDate, null),
}) {}

/* Encoded */

export const PasswordCredentialEncoded =
	Schema.encodedSchema(PasswordCredential);
export type PasswordCredentialEncoded = typeof PasswordCredentialEncoded.Type;

/* Infra */

export const PasswordCredentialInsertable = PasswordCredentialEncoded.pipe(
	Schema.omit("algo", "lastChangedAt", "failedAttempts"),
);
export type PasswordCredentialInsertable =
	typeof PasswordCredentialInsertable.Type;

export interface PasswordCredentialTableDB
	extends PasswordCredentialInsertable {
	algo: Generated<PasswordCredentialEncoded["algo"]>;
	lastChangedAt: Generated<PasswordCredentialEncoded["lastChangedAt"]>;
	failedAttempts: Generated<PasswordCredentialEncoded["failedAttempts"]>;
}
