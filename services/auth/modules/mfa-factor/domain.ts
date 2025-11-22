import { Schema } from "effect";
import { UserIDSchema } from "../user/domain";

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

export const MfaFactorTableDB = Schema.encodedSchema(MfaFactor);
export type MfaFactorTableDB = typeof MfaFactorTableDB.Type;

export const mfaFactorFromUnknown = Schema.decodeUnknown(MfaFactor);
export const mfaFactorToDb = Schema.encode(MfaFactor);
export const toMfaFactor = Schema.decode(MfaFactor);
