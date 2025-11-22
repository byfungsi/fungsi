import { Schema } from "effect";
import { UserIDSchema } from "../user/domain";

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

export const PasswordCredentialTableDB =
	Schema.encodedSchema(PasswordCredential);
export type PasswordCredentialTableDB = typeof PasswordCredentialTableDB.Type;

export const passwordCredentialFromUnknown =
	Schema.decodeUnknown(PasswordCredential);
export const passwordCredentialToDb = Schema.encode(PasswordCredential);
export const toPasswordCredential = Schema.decode(PasswordCredential);
