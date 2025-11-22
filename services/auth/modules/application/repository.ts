import { Effect } from "effect";
import { DatabaseLive, DatabaseService } from "../databaseType";
import { Application, applicationToDb } from "./domain";

export class ApplicationRepository extends Effect.Service<ApplicationRepository>()(
	"service/auth/modules/users/user.repository",
	{
		effect: Effect.gen(function* () {
			const db = yield* DatabaseService;

			const createApplication = Effect.fn("createApplication")(function* (
				application: Application,
			) {
				const applicationDb = yield* applicationToDb(application);
				yield* db.insertInto("applications").values(applicationDb);
			});

			return { createApplication };
		}),
		dependencies: [DatabaseLive],
	},
) {}
