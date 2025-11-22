import { Schema } from "effect";
import { UserIDSchema } from "../user/domain";

export const EmailVerificationTokenIDSchema = Schema.String.pipe(
	Schema.filter((s) => {
		if (!s.startsWith("evtok-")) {
			return "EMAIL VERIFICATION TOKEN ID Schema must start with evtok";
		}
		const ulidId = s.replace("evtok-", "");
		if (!Schema.is(Schema.ULID)(ulidId)) {
			return "The ID doesn't contain valid ULID";
		}

		return true;
	}),
);

export class EmailVerificationToken extends Schema.Class<EmailVerificationToken>(
	"EmailVerificationToken",
)({
	id: EmailVerificationTokenIDSchema,
	userId: UserIDSchema,
	tokenHash: Schema.String,
	expiresAt: Schema.DateTimeUtcFromDate,
	usedAt: Schema.OptionFromNullishOr(Schema.DateTimeUtcFromDate, null),
	createdAt: Schema.DateTimeUtcFromDate,
}) {}

export const EmailVerificationTokenTableDB = Schema.encodedSchema(
	EmailVerificationToken,
);
export type EmailVerificationTokenTableDB =
	typeof EmailVerificationTokenTableDB.Type;

export const emailVerificationTokenFromUnknown = Schema.decodeUnknown(
	EmailVerificationToken,
);
export const emailVerificationTokenToDb = Schema.encode(EmailVerificationToken);
export const toEmailVerificationToken = Schema.decode(EmailVerificationToken);
