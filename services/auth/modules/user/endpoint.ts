import { HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from "@effect/platform";
import { ApplicationIDSchema } from "../application/domain";
import { UserArrayResponse } from "./domain";
import { UserServiceError } from "./service";

const applicationIdParam = HttpApiSchema.param(
	"applicationId",
	ApplicationIDSchema,
);
export const UsersApiGroup = HttpApiGroup.make("users")
	.add(
		HttpApiEndpoint.get(
			"getUserByApplicationId",
		)`/applications/${applicationIdParam}`
			.addSuccess(UserArrayResponse)
			.addError(UserServiceError),
	)
	.prefix("/users");
