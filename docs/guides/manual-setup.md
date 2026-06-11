# Manual setup

These are the one-time steps you do by hand in a browser — they can't be done in
code. You'll need them for login to work. Do the dev versions first; repeat with
your production URL when you deploy.

## 1. Supabase — enable Google login

1. Go to the [Supabase dashboard](https://supabase.com/dashboard) → your project
   (`fomanzxevxoghyzwbqim`).
2. **Authentication → Providers → Google** → toggle it on.
3. You'll need a **Client ID** and **Client Secret** from Google (next step).
   Paste them here and save.

## 2. Google Cloud Console — create OAuth credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) →
   **APIs & Services → Credentials**.
2. **Create Credentials → OAuth client ID → Web application**.
3. Under **Authorized redirect URIs**, add:
   - `http://localhost:3000/auth/callback` (for local development)
   - `https://YOUR-PRODUCTION-DOMAIN/auth/callback` (when you go live)
4. Copy the **Client ID** and **Client Secret** back into Supabase (step 1).

## 3. Supabase — enable Facebook login

1. **Authentication → Providers → Facebook** → toggle it on.
2. You'll need an **App ID** and **App Secret** from Facebook (next step).

## 4. Facebook Developers — create an app

1. Go to [Facebook for Developers](https://developers.facebook.com/) → create an
   app → add **Facebook Login**.
2. Under **Valid OAuth Redirect URIs**, add the same two callback URLs as Google
   above.
3. Copy the **App ID** and **App Secret** back into Supabase (step 3).

## 5. System admin access (Pep)

There is no password for the admin panel anymore — access is by **who you are**.
Your email must be in the `system_admins` list. The first admin is seeded in the
database; after that, add admins from the panel itself. See
[managing-system-admins.md](managing-system-admins.md).

---

**Note:** the matching task checkboxes live in `TODO.md` under "Manual setup". This
guide is the *how*; the TODO is the *reminder*.
