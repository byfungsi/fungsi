import { HttpApi, HttpApiEndpoint, HttpApiGroup } from "@effect/platform";
import { AdminApplicationApiGroup } from "./application/endpoint";
import { HealthResponseDomain } from "./health/domain";
import { UsersApiGroup } from "./user/endpoint";

const RootApiGroup = HttpApiGroup.make("health").add(
	HttpApiEndpoint.get("healthCheck", "/health").addSuccess(
		HealthResponseDomain,
	),
);

const V1HttpApi = HttpApi.make("v1")
	.add(UsersApiGroup)
	.add(AdminApplicationApiGroup)
	.prefix("/v1");

export const RootApi = HttpApi.make("root")
	.add(RootApiGroup)
	.addHttpApi(V1HttpApi);
