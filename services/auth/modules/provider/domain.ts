import { Schema } from "effect";

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

export const ProviderTableDB = Schema.encodedSchema(Provider);
export type ProviderTableDB = typeof ProviderTableDB.Type;

export const providerFromUnknown = Schema.decodeUnknown(Provider);
export const providerToDb = Schema.encode(Provider);
export const toProvider = Schema.decode(Provider);
