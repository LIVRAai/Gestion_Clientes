'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function saveAccessCookie(accessToken: string, expiresIn?: number) {
  const maxAge = expiresIn ?? 60 * 60;
  document.cookie = `sb-access-token=${accessToken}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMsg('');

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(`No pudimos iniciar sesión: ${error.message}`);
      return;
    }

    if (!data.session) {
      setError('No se pudo crear una sesión activa. Intenta nuevamente.');
      return;
    }

    saveAccessCookie(data.session.access_token, data.session.expires_in);
    setMsg('Ingreso exitoso. Redirigiendo...');
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 page-fade-in">
      <section className="hidden lg:flex bg-navy text-white p-12 items-center">
        <div className="max-w-md space-y-4">
          <p className="badge !bg-white/10 !text-blue-100 !border-white/20">NextUp CRM</p>
          <h1 className="text-4xl font-bold leading-tight">Convierte cada contacto en una recompra.</h1>
          <p className="text-blue-100">Gestiona clientes, productos y seguimiento comercial en una sola plataforma moderna.</p>
        </div>
      </section>

      <section className="flex items-center justify-center p-6 bg-slatebg">
        <form onSubmit={onSubmit} className="card w-full max-w-md p-8 space-y-5">
          <div>
            <h2 className="text-3xl font-bold">Iniciar sesión</h2>
            <p className="text-slate-600 text-sm mt-1">Accede a tu centro de control comercial.</p>
          </div>

          <div>
            <label className="label">Correo electrónico</label>
            <input className="input" placeholder="ejemplo@empresa.com" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>

          <div>
            <label className="label">Contraseña</label>
            <input className="input" placeholder="••••••••" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>

          <button className="btn-primary w-full h-11">Entrar a NextUp</button>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {msg && <p className="text-green-700 text-sm">{msg}</p>}

          <p className="text-sm text-slate-600">¿No tienes cuenta? <Link href="/register" className="text-accent font-medium">Crear usuario</Link></p>
        </form>
      </section>
    </div>
  );
}
