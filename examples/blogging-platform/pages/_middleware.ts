import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl
    const hostname = req.headers.get('host')

    const currentHost = process.env.NODE_ENV === 'production' && process.env.VERCEL === '1'
                        ? hostname.replace(`.${process.env.NEXT_PUBLIC_ROOT_URL}`, '')
                        : hostname.replace(`.localhost:3000`, '')

    if (pathname.startsWith(`/sites`)) {
        return new Response(null, { status: 404 })
    }
    
    if (
        !pathname.includes('.') &&
        !pathname.startsWith('/api')
    ) {
        if (currentHost == 'app') {
            if (pathname === '/login' && (req.cookies['next-auth.session-token'] ||  req.cookies['__Secure-next-auth.session-token'])){
                return NextResponse.redirect('/');
            }
            return NextResponse.rewrite(`/app${pathname}`)        
        } else if (currentHost == 'localhost:3000' || currentHost == process.env.NEXT_PUBLIC_ROOT_URL) {
            return NextResponse.rewrite(`/home${pathname}`)        
        }

        return NextResponse.rewrite(`/sites/${currentHost}${pathname}`)
    }
}