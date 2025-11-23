import { Schema } from "effect";

export class SuccessSchema extends Schema.TaggedClass<SuccessSchema>(
	"SuccessSchema",
)("SuccessSchema", {
	message: Schema.String,
	success: Schema.Literal(true),
}) {}

export const makeSuccessResponse = (message: string) =>
	new SuccessSchema({
		message,
		success: true,
	});
