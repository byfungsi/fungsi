import { HttpApiBuilder } from "@effect/platform";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import { Layer } from "effect";
import { MyApiLive } from "./modules/apiLive";

const ServerLive = HttpApiBuilder.serve().pipe(
	Layer.provide(MyApiLive),
	Layer.provide(BunHttpServer.layer({ port: 8000 })),
);

Layer.launch(ServerLive).pipe(BunRuntime.runMain);
