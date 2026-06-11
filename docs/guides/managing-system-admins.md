# Managing system admins

System admins are the people who can access **Pep** — the behind-the-scenes panel
for managing every academy account. This is separate from the roles *inside* an
academy (owner / admin / coach / viewer). A system admin oversees the whole
platform.

## How access works

Access is based on **your login email**, not a shared password. If your email is
in the system-admin list, you get in; if not, you don't. So every system admin
must be able to log in to the app normally (Google, Facebook, or email/password).

When you're a system admin, a **Pep** option appears in the left sidebar (in the
selector just above your Profile). Click it to open the panel.

## Add an admin

1. Open **Pep** (sidebar → the selector above Profile → **Pep**).
2. In the **System admins** section, type the person's **email** (and optionally a
   **name**) and click **Add admin**.
3. That's it. The next time they log in with that email, they'll have access.

> The email must match the one they log in with. If they sign in with Google as
> `jane@gmail.com`, add `jane@gmail.com`.

## Rename an admin

In the same list, edit the **name** field on their row and click **Save**.

## Remove an admin

Click **Remove** on their row. One safeguard: **you can't remove the last
remaining admin** — that would lock everyone out of Pep. The Remove button is
greyed out when only one admin is left.

## "Log in as" an academy (impersonation)

From the **Accounts** list in Pep, **Log in as** drops you into that academy's
dashboard so you can see and fix things as if you were them. You get full
access — you can create and edit, not just look.

- A yellow **"Viewing as [Academy]"** banner appears at the top while you're in.
- Click **Exit** in that banner to return to your own view.

## Behind the scenes (for developers)

- Admins are stored in the `system_admins` table (email + name), matched against
  the logged-in user's email.
- Authorization lives in `requireSystemAdmin()` / `getSystemAdmin()` in
  `lib/auth.ts`; the panel and its actions are in `app/pep/`.
- See [../reference/auth-and-roles.md](../reference/auth-and-roles.md) for the full
  model, and ADRs
  [0003](../decisions/0003-identity-based-pep.md) /
  [0004](../decisions/0004-writes-during-impersonation.md) for why it works this way.
