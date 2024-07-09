CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(320),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
