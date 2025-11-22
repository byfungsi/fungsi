import { HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from "@effect/platform";
import { ApplicationIDSchema } from "../application/domain";

const applicationIdParam = HttpApiSchema.param(
	"applicationId",
	ApplicationIDSchema,
);
export const AdminApplicationApiGroup = HttpApiGroup.make("users")
	.add(
		HttpApiEndpoint.get(
			"getUserByApplicationId",
		)`/applications/${applicationIdParam}`,
	)
	.prefix("/users");
