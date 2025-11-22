import { HttpApiBuilder } from "@effect/platform";
import { Effect, Layer } from "effect";
import { RootApi } from "../apiService";
import { HealthService } from "./service";

export const HealthCheckLive = HttpApiBuilder.group(
	RootApi,
	"health",
	Effect.fn(function* (handlers) {
		const hs = yield* HealthService;

		return handlers.pipe((h) => h.handle("healthCheck", () => hs.getHealth()));
	}),
).pipe(Layer.provide(HealthService.Default));
