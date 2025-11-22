import { Schema } from "effect";

export const HealthResponseDomain = Schema.Struct({
	ok: Schema.Boolean,
});
