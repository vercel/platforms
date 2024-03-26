import { pgTable, uniqueIndex, index, foreignKey, text, timestamp, serial, integer, boolean } from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm"
import { createId } from '@paralleldrive/cuid2';

export const sessions = pgTable("Session", {
	id: text("id").primaryKey().notNull().$defaultFn(() => createId()),
	sessionToken: text("sessionToken").notNull(),
	userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	expires: timestamp("expires", { precision: 3, mode: 'date' }).notNull(),
},
(table) => {
	return {
		sessionTokenKey: uniqueIndex("Session_sessionToken_key").on(table.sessionToken),
		userIdIdx: index("Session_userId_idx").on(table.userId),
	}
});

export const verificationTokens = pgTable("VerificationToken", {
	identifier: text("identifier").notNull(),
	token: text("token").notNull(),
	expires: timestamp("expires", { precision: 3, mode: 'date' }).notNull(),
},
(table) => {
	return {
		tokenKey: uniqueIndex("VerificationToken_token_key").on(table.token),
		identifierTokenKey: uniqueIndex("VerificationToken_identifier_token_key").on(table.identifier, table.token),
	}
});

export const users = pgTable("User", {
	id: text("id").primaryKey().notNull().$defaultFn(() => createId()),
	name: text("name"),
	// if you are using Github OAuth, you can get rid of the username attribute (that is for Twitter OAuth)
	username: text("username"),
	ghUsername: text("gh_username"),
	email: text("email"),
	emailVerified: timestamp("emailVerified", { precision: 3, mode: 'date' }),
	image: text("image"),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'date' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'date' }).notNull(),
},
(table) => {
	return {
		emailKey: uniqueIndex("User_email_key").on(table.email),
	}
});

export const examples = pgTable("Example", {
	id: serial("id").primaryKey().notNull(),
	name: text("name"),
	description: text("description"),
	domainCount: integer("domainCount"),
	url: text("url"),
	image: text("image"),
	imageBlurhash: text("imageBlurhash"),
});

export const accounts = pgTable("Account", {
	id: text("id").primaryKey().notNull().$defaultFn(() => createId()),
	userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	type: text("type").notNull(),
	provider: text("provider").notNull(),
	providerAccountId: text("providerAccountId").notNull(),
	refreshToken: text("refresh_token"),
	refreshTokenExpiresIn: integer("refresh_token_expires_in"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text("scope"),
	idToken: text("id_token"),
	sessionState: text("session_state"),
	oauthTokenSecret: text("oauth_token_secret"),
	oauthToken: text("oauth_token"),
},
(table) => {
	return {
		userIdIdx: index("Account_userId_idx").on(table.userId),
		providerProviderAccountIdKey: uniqueIndex("Account_provider_providerAccountId_key").on(table.provider, table.providerAccountId),
	}
});

export const sites = pgTable("Site", {
	id: text("id").primaryKey().notNull().$defaultFn(() => createId()),
	name: text("name"),
	description: text("description"),
	logo: text("logo").default('https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/JRajRyC-PhBHEinQkupt02jqfKacBVHLWJq7Iy.png'),
	font: text("font").default('font-cal').notNull(),
	image: text("image").default('https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/hxfcV5V-eInX3jbVUhjAt1suB7zB88uGd1j20b.png'),
	imageBlurhash: text("imageBlurhash").default('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAhCAYAAACbffiEAAAACXBIWXMAABYlAAAWJQFJUiTwAAABfUlEQVR4nN3XyZLDIAwE0Pz/v3q3r55JDlSBplsIEI49h76k4opexCK/juP4eXjOT149f2Tf9ySPgcjCc7kdpBTgDPKByKK2bTPFEdMO0RDrusJ0wLRBGCIuelmWJAjkgPGDSIQEMBDCfA2CEPM80+Qwl0JkNxBimiaYGOTUlXYI60YoehzHJDEm7kxjV3whOQTD3AaCuhGKHoYhyb+CBMwjIAFz647kTqyapdV4enGINuDJMSScPmijSwjCaHeLcT77C7EC0C1ugaCTi2HYfAZANgj6Z9A8xY5eiYghDMNQBJNCWhASot0jGsSCUiHWZcSGQjaWWCDaGMOWnsCcn2QhVkRuxqqNxMSdUSElCDbp1hbNOsa6Ugxh7xXauF4DyM1m5BLtCylBXgaxvPXVwEoOBjeIFVODtW74oj1yBQah3E8tyz3SkpolKS9Geo9YMD1QJR1Go4oJkgO1pgbNZq0AOUPChyjvh7vlXaQa+X1UXwKxgHokB2XPxbX+AnijwIU4ahazAAAAAElFTkSuQmCC'),
	subdomain: text("subdomain"),
	customDomain: text("customDomain"),
	message404: text("message404").default("Blimey! You've found a page that doesn''t exist."),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'date' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'date' }).notNull(),
	userId: text("userId").references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => {
	return {
		subdomainKey: uniqueIndex("Site_subdomain_key").on(table.subdomain),
		customDomainKey: uniqueIndex("Site_customDomain_key").on(table.customDomain),
		userIdIdx: index("Site_userId_idx").on(table.userId),
	}
});

export const posts = pgTable("Post", {
	id: text("id").primaryKey().notNull().$defaultFn(() => createId()),
	title: text("title"),
	description: text("description"),
	content: text("content"),
	slug: text("slug").notNull().$defaultFn(() => createId()),
	image: text("image").default('https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/hxfcV5V-eInX3jbVUhjAt1suB7zB88uGd1j20b.png'),
	imageBlurhash: text("imageBlurhash").default('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAhCAYAAACbffiEAAAACXBIWXMAABYlAAAWJQFJUiTwAAABfUlEQVR4nN3XyZLDIAwE0Pz/v3q3r55JDlSBplsIEI49h76k4opexCK/juP4eXjOT149f2Tf9ySPgcjCc7kdpBTgDPKByKK2bTPFEdMO0RDrusJ0wLRBGCIuelmWJAjkgPGDSIQEMBDCfA2CEPM80+Qwl0JkNxBimiaYGOTUlXYI60YoehzHJDEm7kxjV3whOQTD3AaCuhGKHoYhyb+CBMwjIAFz647kTqyapdV4enGINuDJMSScPmijSwjCaHeLcT77C7EC0C1ugaCTi2HYfAZANgj6Z9A8xY5eiYghDMNQBJNCWhASot0jGsSCUiHWZcSGQjaWWCDaGMOWnsCcn2QhVkRuxqqNxMSdUSElCDbp1hbNOsa6Ugxh7xXauF4DyM1m5BLtCylBXgaxvPXVwEoOBjeIFVODtW74oj1yBQah3E8tyz3SkpolKS9Geo9YMD1QJR1Go4oJkgO1pgbNZq0AOUPChyjvh7vlXaQa+X1UXwKxgHokB2XPxbX+AnijwIU4ahazAAAAAElFTkSuQmCC'),
	createdAt: timestamp("createdAt", { precision: 3, mode: 'date' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'date' }).notNull(),
	published: boolean("published").default(false).notNull(),
	siteId: text("siteId").references(() => sites.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	userId: text("userId").references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => {
	return {
		siteIdIdx: index("Post_siteId_idx").on(table.siteId),
		userIdIdx: index("Post_userId_idx").on(table.userId),
		slugSiteIdKey: uniqueIndex("Post_slug_siteId_key").on(table.slug, table.siteId),
	}
});

export const postsRelations = relations(posts, ({one}) => ({
	site: one(sites, {references: [sites.id], fields: [posts.siteId]}),
	user: one(users, {references: [users.id], fields: [posts.userId]})
}))

export const sitesRelations = relations(sites, ({one, many}) => ({
	posts: many(posts),
	user: one(users, {references: [users.id], fields: [sites.userId]})
}))

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(users, {references: [users.id], fields: [sessions.userId]})
}))

export const accountsRelations = relations(accounts, ({one}) => ({
	user: one(users, {references: [users.id], fields: [accounts.userId]})
}))

export const userRelations = relations(users, ({many}) => ({
	accounts: many(accounts),
	sessions: many(sessions),
	sites: many(sites),
	posts: many(posts),
}))

export type SelectSite = typeof sites.$inferSelect
export type SelectPost = typeof posts.$inferSelect
export type SelectExample = typeof examples.$inferSelect
