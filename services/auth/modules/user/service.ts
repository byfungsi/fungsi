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
			const getUserByApplicationId = (applicationId: string) => {
				return ur
					.getUserByApplicationId(applicationId)
					.pipe(
						Effect.catchAll((error) =>
							Effect.fail(new UserServiceError({ cause: error })),
						),
					);
			};
			return { getUserByApplicationId };
		}),
		dependencies: [UserRepository.Default],
	},
) {}
