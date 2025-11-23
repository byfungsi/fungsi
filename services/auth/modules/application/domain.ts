import { Schema } from "effect";
import { Generated } from "kysely";

/* Pure Domain */
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

/* Encoded */
export const ApplicationEncoded = Schema.encodedSchema(Application);
export type ApplicationEncoded = typeof ApplicationEncoded.Type;

/* Infra */
export const ApplicationInsertable = ApplicationEncoded.pipe(
	Schema.omit("createdAt", "updatedAt"),
);
export type ApplicationInsertable = typeof ApplicationInsertable.Type;

export interface ApplicationTableDB extends ApplicationInsertable {
	createdAt: Generated<ApplicationEncoded["createdAt"]>;
	updatedAt: Generated<ApplicationEncoded["updatedAt"]>;
}

/* DTO */
export const CreateApplicationDTO = Application.pipe(
	Schema.omit("id", "createdAt", "updatedAt"),
);
export type CreateApplicationDTO = typeof CreateApplicationDTO.Type;
