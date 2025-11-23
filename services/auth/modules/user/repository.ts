import { Effect, Schema } from "effect";
import { ApplicationIDSchema } from "../application/domain";
import { DatabaseLive, DatabaseService } from "../databaseType";
import { UserArrayResponse } from "./domain";

export class UserRepository extends Effect.Service<UserRepository>()(
	"service/auth/modules/users/user.repository",
	{
		effect: Effect.gen(function* () {
			const db = yield* DatabaseService;
			const getUserByApplicationId = Effect.fn("getUserByApplicationId")(
				function* (applicationId: string) {
					{
						const AppId =
							yield* Schema.decodeUnknown(ApplicationIDSchema)(applicationId);
						const users = yield* db
							.selectFrom("users")
							.select([
								"id",
								"email",
								"createdAt",
								"updatedAt",
								"emailVerifiedAt",
							])
							.where("users.applicationId", "=", AppId);

						const userResponse =
							yield* Schema.decodeUnknown(UserArrayResponse)(users);

						return userResponse;
					}
				},
			);

			return { getUserByApplicationId };
		}),
		dependencies: [DatabaseLive],
	},
) {}
