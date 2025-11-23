import { HttpApiBuilder } from "@effect/platform";
import { Effect, Layer } from "effect";
import { RootApi } from "../apiService";
import { makeSuccessResponse } from "../common/success";
import { ApplicationService } from "./service";

export const ApplicationLive = HttpApiBuilder.group(
	RootApi,
	"applicationAdmin",
	(handlers) =>
		Effect.gen(function* () {
			const applicationService = yield* ApplicationService;

			return handlers.handle(
				"createApplication",
				Effect.fn(function* ({ payload }) {
					yield* applicationService.createApplication(payload);

					return makeSuccessResponse("User Created");
				}),
			);
		}),
).pipe(Layer.provide(ApplicationService.Default));
