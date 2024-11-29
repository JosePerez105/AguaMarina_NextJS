import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { fetchUserById } from './api/fetchs/get_usuarios';

interface JwtPayload {
    id_user: number;
    id_rol: number;
  }

export async function middleware(req: NextRequest) {
    
    const token = req.cookies.get('token')?.value || "";
    // console.log({token})
    

    if (!token) {
        // Redirigir si la cookie no está presente
        return NextResponse.redirect(new URL('/login', req.url));
    }else {
        const payload = jwt.decode(token) as JwtPayload;
        const dataUser = await fetchUserById(payload.id_user);
        if (!dataUser.accessDashboard)
            return NextResponse.redirect(new URL('/login', req.url));
    }

  return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*']
};

/*



*/