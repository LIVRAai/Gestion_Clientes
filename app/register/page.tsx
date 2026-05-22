'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

function saveAccessCookie(accessToken: string, expiresIn?: number) {
  const maxAge = expiresIn ?? 60 * 60;
  document.cookie = `sb-access-token=${accessToken}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export default function RegisterPage() {
  const router = useRouter();
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'error' | 'success' | 'info'>('info');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email'));
    const password = String(fd.get('password'));

    setMsg('');
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setMsgType('error');
      setMsg(`No pudimos completar el registro: ${error.message}`);
      return;
    }

    let activeSession = data.session;

    if (!activeSession) {
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) {
        setMsgType('error');
        setMsg(`Usuario creado, pero no se pudo abrir sesión automáticamente: ${loginError.message}`);
        return;
      }
      activeSession = loginData.session;
    }

    if (!activeSession) {
      setMsgType('error');
      setMsg('Usuario creado, pero no se encontró una sesión activa. Intenta iniciar sesión manualmente.');
      return;
    }

    saveAccessCookie(activeSession.access_token, activeSession.expires_in);
    setMsgType('success');
    setMsg('Registro exitoso. Redirigiendo al dashboard...');
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 page-fade-in">
      <section className="hidden lg:flex bg-gradient-to-br from-navy to-[#102C59] text-white p-12 items-center">
        <div className="max-w-md space-y-4">
          <p className="badge !bg-white/10 !text-blue-100 !border-white/20">Nuevo usuario</p>
          <h1 className="text-4xl font-bold leading-tight">Crea tu espacio comercial en minutos.</h1>
          <p className="text-blue-100">Organiza clientes, registra compras y activa oportunidades de recompra desde el primer día.</p>
        </div>
      </section>

      <section className="flex items-center justify-center p-6 bg-slatebg">
        <form onSubmit={onSubmit} className="card w-full max-w-md p-8 space-y-5">
          <div>
            <h2 className="text-3xl font-bold">Crear cuenta</h2>
            <p className="text-slate-600 text-sm mt-1">Empieza a gestionar tu CRM con experiencia premium.</p>
          </div>

          <div>
            <label className="label">Correo electrónico</label>
            <input name="email" className="input" placeholder="ejemplo@empresa.com" required />
          </div>

          <div>
            <label className="label">Contraseña</label>
            <input name="password" type="password" className="input" placeholder="Mínimo 6 caracteres" required />
            <p className="help">Usa una contraseña segura para proteger tus datos comerciales.</p>
          </div>

          <button className="btn-primary w-full h-11">Crear usuario y continuar</button>

          {msg && (
            <p className={`text-sm ${msgType === 'error' ? 'text-red-600' : msgType === 'success' ? 'text-green-700' : 'text-slate-700'}`}>
              {msg}
            </p>
          )}

          <p className="text-sm text-slate-600">¿Ya tienes cuenta? <Link href="/login" className="text-accent font-medium">Iniciar sesión</Link></p>
        </form>
      </section>
    </div>
  );
}
