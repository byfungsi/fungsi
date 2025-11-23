import { Schema } from "effect";
import { Generated } from "kysely";
import { UserIDSchema } from "../user/domain";

/* Pure Domain */

export const MfaFactorIDSchema = Schema.String.pipe(
	Schema.filter((s) => {
		if (!s.startsWith("mfa-")) {
			return "MFA FACTOR ID Schema must start with mfa";
		}
		const ulidId = s.replace("mfa-", "");
		if (!Schema.is(Schema.ULID)(ulidId)) {
			return "The ID doesn't contain valid ULID";
		}

		return true;
	}),
);

export class MfaFactor extends Schema.Class<MfaFactor>("MfaFactor")({
	id: MfaFactorIDSchema,
	userId: UserIDSchema,
	type: Schema.String,
	secretEnc: Schema.OptionFromNullishOr(Schema.String, null),
	label: Schema.OptionFromNullishOr(Schema.String, null),
	addedAt: Schema.DateTimeUtcFromDate,
	disabledAt: Schema.OptionFromNullishOr(Schema.DateTimeUtcFromDate, null),
}) {}

/* Encoded */

export const MfaFactorEncoded = Schema.encodedSchema(MfaFactor);
export type MfaFactorEncoded = typeof MfaFactorEncoded.Type;

/* Infra */

export const MfaFactorInsertable = MfaFactorEncoded.pipe(
	Schema.omit("addedAt"),
);
export type MfaFactorInsertable = typeof MfaFactorInsertable.Type;

export interface MfaFactorTableDB extends MfaFactorInsertable {
	addedAt: Generated<MfaFactorEncoded["addedAt"]>;
}
