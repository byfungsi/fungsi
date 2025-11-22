import * as PgKysely from "@effect/sql-kysely/Pg";
import { Context, Layer } from "effect";
import { SqlLive } from "../database";
import { AccountTableDB } from "./account/domain";
import { ApplicationTableDB } from "./application/domain";
import { AuthEventTableDB } from "./auth-event/domain";
import { EmailVerificationTokenTableDB } from "./email-verification-token/domain";
import { MfaFactorTableDB } from "./mfa-factor/domain";
import { PasswordCredentialTableDB } from "./password-credential/domain";
import { PasswordResetTokenTableDB } from "./password-reset-token/domain";
import { ProviderTableDB } from "./provider/domain";
import { SessionTableDB } from "./session/domain";
import { UserTableDB } from "./user/domain";

export interface DBType {
	applications: ApplicationTableDB;
	users: UserTableDB;
	providers: ProviderTableDB;
	accounts: AccountTableDB;
	sessions: SessionTableDB;
	password_credentials: PasswordCredentialTableDB;
	email_verification_tokens: EmailVerificationTokenTableDB;
	password_reset_tokens: PasswordResetTokenTableDB;
	mfa_factors: MfaFactorTableDB;
	auth_events: AuthEventTableDB;
}

export class DatabaseService extends Context.Tag("DatabaseService")<
	DatabaseService,
	PgKysely.EffectKysely<DBType>
>() {}

export const DatabaseLive = Layer.effect(
	DatabaseService,
	PgKysely.make<DBType>(),
).pipe(Layer.provide(SqlLive));
