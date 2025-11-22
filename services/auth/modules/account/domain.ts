import { Schema } from "effect";
import { ProviderIDSchema } from "../provider/domain";
import { UserIDSchema } from "../user/domain";

export const AccountIDSchema = Schema.String.pipe(
	Schema.filter((s) => {
		if (!s.startsWith("acc-")) {
			return "ACCOUNT ID Schema must start with acc";
		}
		const ulidId = s.replace("acc-", "");
		if (!Schema.is(Schema.ULID)(ulidId)) {
			return "The ID doesn't contain valid ULID";
		}

		return true;
	}),
);

export class Account extends Schema.Class<Account>("Account")({
	id: AccountIDSchema,
	userId: UserIDSchema,
	providerId: ProviderIDSchema,
	providerUserId: Schema.String,
	accessTokenEnc: Schema.OptionFromNullishOr(Schema.String, null),
	accessTokenExpiredAt: Schema.OptionFromNullishOr(
		Schema.DateTimeUtcFromDate,
		null,
	),
	refreshTokenHash: Schema.OptionFromNullishOr(Schema.String, null),
	refreshTokenExpiredAt: Schema.OptionFromNullishOr(
		Schema.DateTimeUtcFromDate,
		null,
	),
	idTokenEnc: Schema.OptionFromNullishOr(Schema.String, null),
	scope: Schema.OptionFromNullishOr(Schema.Array(Schema.String), null),
	createdAt: Schema.DateTimeUtcFromDate,
	updatedAt: Schema.DateTimeUtcFromDate,
}) {}

export const AccountTableDB = Schema.encodedSchema(Account);
export type AccountTableDB = typeof AccountTableDB.Type;

export const accountFromUnknown = Schema.decodeUnknown(Account);
export const accountToDb = Schema.encode(Account);
export const toAccount = Schema.decode(Account);
