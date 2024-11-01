import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    // Accediendo a la cookie 'jwt_ag'
    const cookieValue = req.cookies.get('jwt_ag');

    console.log("Middleware ejecutado"); // Este debería aparecer en la consola del servidor
    console.log({ cookieValue }); // Muestra el valor de la cookie en la consola del servidor

    // if (!cookieValue) {
    //     // Redirigir si la cookie no está presente
    //     return NextResponse.redirect(new URL('/admin', req.url));
    // }

    return NextResponse.next(); // Continúa con la solicitud
}

export const config = {
    matcher: ['/admin/categorias', '/admin/productos']
};
