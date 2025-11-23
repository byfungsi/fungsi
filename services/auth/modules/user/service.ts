import { Effect, Schema } from "effect";
import { UserRepository } from "./repository";

export class UserServiceError extends Schema.TaggedError<UserServiceError>()(
	"UserServiceError",
	{
		cause: Schema.Defect,
	},
) {}

export class UserService extends Effect.Service<UserService>()(
	"mservice/auth/modules/user/srvice",
	{
		effect: Effect.gen(function* () {
			const ur = yield* UserRepository;
			const getUserByApplicationId = Effect.fn(
				"module/user/service/getUserByApplicationId",
			)(
				function* (applicationId: string) {
					return yield* Effect.fail();
					return yield* ur.getUserByApplicationId(applicationId);
				},
				Effect.mapError((cause) => new UserServiceError({ cause })),
			);
			return { getUserByApplicationId };
		}),
		dependencies: [UserRepository.Default],
	},
) {}
