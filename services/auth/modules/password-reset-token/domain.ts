import { Schema } from "effect";
import { UserIDSchema } from "../user/domain";

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

export const PasswordResetTokenTableDB =
	Schema.encodedSchema(PasswordResetToken);
export type PasswordResetTokenTableDB = typeof PasswordResetTokenTableDB.Type;

export const passwordResetTokenFromUnknown =
	Schema.decodeUnknown(PasswordResetToken);
export const passwordResetTokenToDb = Schema.encode(PasswordResetToken);
export const toPasswordResetToken = Schema.decode(PasswordResetToken);
