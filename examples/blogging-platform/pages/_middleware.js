import { NextResponse } from "next/server";

export default function middleware(req) {
  const { pathname } = req.nextUrl; // get pathname of request (e.g. /blog-slug)
  const hostname = req.headers.get("host"); // get hostname of request (e.g. demo.vercel.pub)

  if (hostname === "vercel.pub") {
    // only for demo purposes – remove this if you want to use your root domain as the landing page
    return NextResponse.redirect("https://demo.vercel.pub");
  }

  const currentHost =
    process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
      ? hostname.replace(`.vercel.pub`, "")
      : hostname.replace(`.localhost:3000`, "");

  if (pathname.startsWith(`/_sites`)) {
    return new Response(null, { status: 404 });
  }

  if (!pathname.includes(".") && !pathname.startsWith("/api")) {
    if (currentHost == "app") {
      if (
        pathname === "/login" &&
        (req.cookies["next-auth.session-token"] ||
          req.cookies["__Secure-next-auth.session-token"])
      ) {
        return NextResponse.redirect("/");
      }
      return NextResponse.rewrite(`/app${pathname}`);
    } else if (hostname === "localhost:3000") {
      return NextResponse.rewrite(`/home`);
    } else {
      return NextResponse.rewrite(`/_sites/${currentHost}${pathname}`);
    }
  }
}
