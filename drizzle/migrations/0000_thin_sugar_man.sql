CREATE TABLE "tenants" (
	"id" serial PRIMARY KEY NOT NULL,
	"subdomain" text NOT NULL,
	"emoji" text NOT NULL,
	"created_at" bigint NOT NULL,
	CONSTRAINT "tenants_subdomain_unique" UNIQUE("subdomain")
);
