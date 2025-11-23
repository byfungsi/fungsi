import { Schema } from "effect";
import { Generated } from "kysely";

/* Pure Domain */

export const ProviderIDSchema = Schema.String.pipe(
	Schema.filter((s) => {
		if (!s.startsWith("prvdr-")) {
			return "PROVIDER ID Schema must start with prvdr";
		}
		const ulidId = s.replace("prvdr-", "");
		if (!Schema.is(Schema.ULID)(ulidId)) {
			return "The ID doesn't contain valid ULID";
		}

		return true;
	}),
);

export class Provider extends Schema.Class<Provider>("Provider")({
	id: ProviderIDSchema,
	name: Schema.String,
	createdAt: Schema.DateTimeUtcFromDate,
	updatedAt: Schema.DateTimeUtcFromDate,
}) {}

/* Encoded */

export const ProviderEncoded = Schema.encodedSchema(Provider);
export type ProviderEncoded = typeof ProviderEncoded.Type;

/* Infra */

export const ProviderInsertable = ProviderEncoded.pipe(
	Schema.omit("createdAt", "updatedAt"),
);
export type ProviderInsertable = typeof ProviderInsertable.Type;

export interface ProviderTableDB extends ProviderInsertable {
	createdAt: Generated<ProviderEncoded["createdAt"]>;
	updatedAt: Generated<ProviderEncoded["updatedAt"]>;
}
