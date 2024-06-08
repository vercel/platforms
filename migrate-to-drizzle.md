## If you directly start the project with Drizzle ORM

1. **Remove unnecessary schema file**: Delete `lib/legacy-schema.ts` file as it is only used when migrating from Prisma.
2. **Initialize Schema**: The Drizzle schema located in `lib/schema.ts` will be used for database queries.
2. **Apply changes to the database**: Run the `drizzle-kit push` command to apply your changes to the database. Learn more about the push command [here](https://orm.drizzle.team/kit-docs/overview#prototyping-with-db-push).
3. **Begin using the template**: You can now start using this template with Drizzle ORM.

## If you migrating from Prisma

1. **Replace the schema file**: Remove the existing `lib/schema.ts` file and rename `lib/legacy-schema.ts` to `lib/schema.ts`.
2. **Update database schema**: `email` column in `users` table is set to `not null` to ensure compatibility with drizzle next-auth adapter. Apply this change by running the `drizzle-kit push` command. Learn more about `push` command [here](https://orm.drizzle.team/kit-docs/overview#prototyping-with-db-push).
3. **Complete migration**: You are now ready to use this template with Drizzle ORM.
