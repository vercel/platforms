import { NextResponse } from "next/server";

export default function middleware(req) {
  const { pathname } = req.nextUrl;
  const hostname = req.headers.get("host");
  console.log("hostname is ", hostname);
  const currentHost =
    process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
      ? hostname.replace(`.vercel.pub`, "")
      : hostname.replace(`.localhost:3000`, "");

  console.log("currentHost is ", currentHost);
  console.log("pathname is ", pathname);

  if (pathname.startsWith(`/_sites`)) {
    return new Response(null, { status: 404 });
  }

  if (!pathname.includes(".") && !pathname.startsWith("/api")) {
    console.log("first logic passed, pathname is not broken");
    if (currentHost == "app") {
      if (
        pathname === "/login" &&
        (req.cookies["next-auth.session-token"] ||
          req.cookies["__Secure-next-auth.session-token"])
      ) {
        return NextResponse.redirect("/");
      }
      return NextResponse.rewrite(`/app${pathname}`);
    } else if (
      currentHost == "localhost:3000" ||
      currentHost == process.env.NEXT_PUBLIC_ROOT_URL
    ) {
      return NextResponse.rewrite(`/home${pathname}`);
    }
    console.log("should be good ", currentHost, pathname);
    return NextResponse.rewrite(`/_sites/${currentHost}${pathname}`);
  }
}
