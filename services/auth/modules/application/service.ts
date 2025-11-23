import { Effect, Schema } from "effect";
import { ulid } from "ulid";
import { CreateApplicationDTO } from "./domain";
import { ApplicationRepository } from "./repository";

export class ApplicationServiceError extends Schema.TaggedError<ApplicationServiceError>()(
	"ApplicationServiceError",
	{
		cause: Schema.Defect,
	},
) {}

export class ApplicationService extends Effect.Service<ApplicationService>()(
	"mservice/auth/modules/application/srvice",
	{
		effect: Effect.gen(function* () {
			const appRepository = yield* ApplicationRepository;
			const createApplication = Effect.fn(
				"application/service/createApplication",
			)(
				function* (application: CreateApplicationDTO) {
					const applicationId = `app-${ulid()}`;
					const insertable =
						yield* Schema.encode(CreateApplicationDTO)(application);

					return yield* appRepository.createApplication({
						id: applicationId,
						...insertable,
					});
				},
				Effect.mapError((cause) => new ApplicationServiceError({ cause })),
			);

			return { createApplication };
		}),
		dependencies: [ApplicationRepository.Default],
	},
) {}
