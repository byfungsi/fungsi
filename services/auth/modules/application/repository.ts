import { Effect } from "effect";
import { DatabaseLive, DatabaseService } from "../databaseType";
import { ApplicationInsertable } from "./domain";

export class ApplicationRepository extends Effect.Service<ApplicationRepository>()(
	"service/auth/modules/application/application.repository",
	{
		effect: Effect.gen(function* () {
			const db = yield* DatabaseService;

			const createApplication = Effect.fn(
				"application/repository/createApplication",
			)(function* (application: ApplicationInsertable) {
				yield* db.insertInto("applications").values(application);
			});

			return { createApplication };
		}),
		dependencies: [DatabaseLive],
	},
) {}
