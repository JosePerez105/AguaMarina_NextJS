import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

interface JwtPayload {
    id_user: number;
    names: string;
    lastnames: string;
    dni: string;
    mail: string;
    phone_number: string;
    id_rol: number;
    status: boolean;
    iat: number;
    exp: number;
  }
  

export function middleware(req: NextRequest) {
    
    const token = req.cookies.get('token')?.value || "";
    // console.log({token})

    if (!token) {
        // Redirigir si la cookie no está presente
        return NextResponse.redirect(new URL('/login', req.url));
    }else {
        const payload = jwt.decode(token) as JwtPayload;
        if (payload.id_rol != 1)
            return NextResponse.redirect(new URL('/login', req.url));
    }

  return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*']
};