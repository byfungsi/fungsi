import { HttpApiBuilder } from "@effect/platform";
import { Effect, Layer } from "effect";
import { RootApi } from "../apiService";
import { UserService } from "./service";

export const UsersLive = HttpApiBuilder.group(RootApi, "users", (handlers) =>
	Effect.gen(function* () {
		const userService = yield* UserService;

		return handlers.handle("getUserByApplicationId", ({ path }) => {
			const { applicationId } = path;
			return userService.getUserByApplicationId(applicationId);
		});
	}),
).pipe(Layer.provide(UserService.Default));
