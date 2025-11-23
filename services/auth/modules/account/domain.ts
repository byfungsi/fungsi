import { Schema } from "effect";
import { Generated } from "kysely";
import { ProviderIDSchema } from "../provider/domain";
import { UserIDSchema } from "../user/domain";

/* Pure Domain */

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

/* Encoded */

export const AccountEncoded = Schema.encodedSchema(Account);
export type AccountEncoded = typeof AccountEncoded.Type;

/* Infra */

export const AccountInsertable = AccountEncoded.pipe(
	Schema.omit("createdAt", "updatedAt"),
);
export type AccountInsertable = typeof AccountInsertable.Type;

export interface AccountTableDB extends AccountInsertable {
	createdAt: Generated<AccountEncoded["createdAt"]>;
	updatedAt: Generated<AccountEncoded["updatedAt"]>;
}
