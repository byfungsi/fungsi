import {
	HttpApiBuilder,
	HttpMiddleware,
	HttpServerResponse,
} from "@effect/platform";
import { HttpApiDecodeError } from "@effect/platform/HttpApiError";
import { Effect, Layer } from "effect";
import { RootApi } from "./apiService";
import { HealthCheckLive } from "./health/route";
import { UsersLive } from "./user/route";
import { ApplicationLive } from "./application/route";

const ErrorHandler = HttpMiddleware.make((app) =>
	app.pipe(
		Effect.tapErrorCause(Effect.logError),
		Effect.catchTags({
			RouteNotFound: () =>
				HttpServerResponse.text("Not Found", { status: 404 }),
		}),
		Effect.catchAll((cause) => {
			if (cause instanceof HttpApiDecodeError && cause.issues[0]) {
				return HttpServerResponse.json(
					{
						code: "DECODE_ERROR",
						message: "Error when decoding",
						issues: cause.issues,
					},
					{
						status: 400,
					},
				);
			}
			return HttpServerResponse.json(
				{
					code: "SERVER_ERROR",
					cause: cause,
				},
				{
					status: 500,
				},
			);
		}),
		Effect.catchAll(() => HttpServerResponse.text("Unexpected Error")),
	),
);

export const MyApiLive = HttpApiBuilder.api(RootApi).pipe(
	Layer.provide(HttpApiBuilder.middleware(ErrorHandler)),
	Layer.provide(UsersLive),
	Layer.provide(ApplicationLive),
	Layer.provide(HealthCheckLive),
);
