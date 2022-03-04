import { NextResponse } from "next/server";

export default function middleware(req) {
  const url = req.nextUrl.clone(); // clone the request url
  const { pathname } = req.nextUrl; // get pathname of request (e.g. /blog-slug)
  const hostname = req.headers.get("host"); // get hostname of request (e.g. demo.vercel.pub)

  // only for demo purposes – remove this if you want to use your root domain as the landing page
  if (hostname === "vercel.pub" || hostname === "platforms.vercel.app") {
    return NextResponse.redirect("https://demo.vercel.pub");
  }

  const currentHost =
    process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
      ? hostname
          .replace(`.vercel.pub`, "") // you have to replace ".vercel.pub" with your own domain if you deploy this example under your domain.
          .replace(`.platformize.vercel.app`, "") // you can use wildcard subdomains on .vercel.app links that are associated with your Vercel team slug
      : // in this case, our team slug is "platformize", thus *.platformize.vercel.app works
        hostname.replace(`.localhost:3000`, "");

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
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
      url.pathname = `/app${pathname}`;
      return NextResponse.rewrite(url);
    } else if (
      hostname === "localhost:3000" ||
      hostname === "platformize.vercel.app"
    ) {
      url.pathname = `/home`;
      return NextResponse.rewrite(url);
    } else {
      url.pathname = `/_sites/${currentHost}${pathname}`;
      return NextResponse.rewrite(url);
    }
  }
}
