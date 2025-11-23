import { Schema } from "effect";
import { Generated } from "kysely";
import { UserIDSchema } from "../user/domain";

/* Pure Domain */

export const PasswordResetTokenIDSchema = Schema.String.pipe(
	Schema.filter((s) => {
		if (!s.startsWith("prtok-")) {
			return "PASSWORD RESET TOKEN ID Schema must start with prtok";
		}
		const ulidId = s.replace("prtok-", "");
		if (!Schema.is(Schema.ULID)(ulidId)) {
			return "The ID doesn't contain valid ULID";
		}

		return true;
	}),
);

export class PasswordResetToken extends Schema.Class<PasswordResetToken>(
	"PasswordResetToken",
)({
	id: PasswordResetTokenIDSchema,
	userId: UserIDSchema,
	tokenHash: Schema.String,
	expiresAt: Schema.DateTimeUtcFromDate,
	usedAt: Schema.OptionFromNullishOr(Schema.DateTimeUtcFromDate, null),
	createdAt: Schema.DateTimeUtcFromDate,
}) {}

/* Encoded */

export const PasswordResetTokenEncoded =
	Schema.encodedSchema(PasswordResetToken);
export type PasswordResetTokenEncoded = typeof PasswordResetTokenEncoded.Type;

/* Infra */

export const PasswordResetTokenInsertable = PasswordResetTokenEncoded.pipe(
	Schema.omit("createdAt"),
);
export type PasswordResetTokenInsertable =
	typeof PasswordResetTokenInsertable.Type;

export interface PasswordResetTokenTableDB
	extends PasswordResetTokenInsertable {
	createdAt: Generated<PasswordResetTokenEncoded["createdAt"]>;
}
