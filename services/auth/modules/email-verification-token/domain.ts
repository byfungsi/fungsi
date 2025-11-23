import { Schema } from "effect";
import { Generated } from "kysely";
import { UserIDSchema } from "../user/domain";

/* Pure Domain */

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

/* Encoded */

export const EmailVerificationTokenEncoded = Schema.encodedSchema(
	EmailVerificationToken,
);
export type EmailVerificationTokenEncoded =
	typeof EmailVerificationTokenEncoded.Type;

/* Infra */

export const EmailVerificationTokenInsertable = EmailVerificationTokenEncoded.pipe(
	Schema.omit("createdAt"),
);
export type EmailVerificationTokenInsertable =
	typeof EmailVerificationTokenInsertable.Type;

export interface EmailVerificationTokenTableDB
	extends EmailVerificationTokenInsertable {
	createdAt: Generated<EmailVerificationTokenEncoded["createdAt"]>;
}
