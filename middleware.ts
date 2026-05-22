import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const privadas = ['/dashboard', '/clientes', '/productos', '/compras', '/analitica', '/mensajes', '/pipeline', '/recompra', '/tareas'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!privadas.some((p) => pathname.startsWith(p))) return NextResponse.next();
  const hasSession = request.cookies.get('sb-access-token');
  if (!hasSession) return NextResponse.redirect(new URL('/login', request.url));
  return NextResponse.next();
}

export const config = { matcher: ['/dashboard/:path*', '/clientes/:path*', '/productos/:path*', '/compras/:path*', '/analitica/:path*', '/mensajes/:path*', '/pipeline/:path*', '/recompra/:path*', '/tareas/:path*'] };
