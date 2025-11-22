import { Schema } from "effect";

export const ApplicationIDSchema = Schema.String.pipe(
	Schema.filter((s) => {
		if (!s.startsWith("app-")) {
			return "APPLICATION ID Schema must start with app";
		}
		const ulidId = s.replace("app-", "");
		if (!Schema.is(Schema.ULID)(ulidId)) {
			return "The ID doesn't contain valid ULID";
		}

		return true;
	}),
);

export class Application extends Schema.Class<Application>("Application")({
	id: ApplicationIDSchema,
	name: Schema.String,
	domain: Schema.OptionFromNullishOr(Schema.String, null),
	callbackUrls: Schema.OptionFromNullishOr(Schema.Array(Schema.String), null),
	allowedOrigins: Schema.OptionFromNullishOr(Schema.Array(Schema.String), null),
	createdAt: Schema.DateFromSelf,
	updatedAt: Schema.DateFromSelf,
}) {}

export const ApplicationTableDB = Schema.encodedSchema(Application);

export const applicationFromUnknown = Schema.decodeUnknown(Application);
export const applicationToDb = Schema.encode(Application);
export const toApplication = Schema.decode(Application);

export type ApplicationTableDB = typeof ApplicationTableDB.Type;
