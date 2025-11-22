import { Effect } from "effect";

export class HealthService extends Effect.Service<HealthService>()(
	"fungsi/auth/module/health/service",
	{
		sync: () => ({
			getHealth: () => Effect.succeed({ ok: true }),
		}),
	},
) {}
