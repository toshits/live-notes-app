import { NextRequest, NextResponse } from "next/server"

export const middleware = (req: NextRequest) => {
    let token = req.cookies.get('token')
    if (token == null && req.nextUrl.pathname != '/login') {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    if (token && req.nextUrl.pathname == '/login') {
        return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
}