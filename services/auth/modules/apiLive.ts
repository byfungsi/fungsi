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

const ErrorHandler = HttpMiddleware.make((app) =>
	app.pipe(
		Effect.tapErrorCause(Effect.logError),
		Effect.catchTags({
			RouteNotFound: () =>
				HttpServerResponse.text("Not Found", { status: 404 }),
		}),
		Effect.catchAll((cause) => {
			if (cause instanceof HttpApiDecodeError && cause.issues[0]) {
				const message = cause.issues[0].message;
				return HttpServerResponse.text(
					JSON.stringify({
						code: "SERVER_ERROR",
						message,
					}),
					{
						status: 500,
					},
				);
			}
			return HttpServerResponse.text(
				JSON.stringify({
					message: "SERVER_ERROR",
					cause: cause,
				}),
				{
					status: 500,
				},
			);
		}),
	),
);

export const MyApiLive = HttpApiBuilder.api(RootApi).pipe(
	Layer.provide(HttpApiBuilder.middleware(ErrorHandler)),
	Layer.provide(UsersLive),
	Layer.provide(HealthCheckLive),
);
