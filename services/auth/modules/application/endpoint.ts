import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform";
import { SuccessSchema } from "../common/success";
import { CreateApplicationDTO } from "./domain";
import { ApplicationServiceError } from "./service";

export const AdminApplicationApiGroup = HttpApiGroup.make("applicationAdmin")
	.add(
		HttpApiEndpoint.post("createApplication")`/`
			.setPayload(CreateApplicationDTO)
			.addSuccess(SuccessSchema, { status: 201 })
			.addError(ApplicationServiceError),
	)
	.prefix("/admin/applications");
