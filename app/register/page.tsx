'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

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
    <form onSubmit={onSubmit} className="min-h-screen flex items-center justify-center">
      <div className="card p-8 w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Crear cuenta</h1>
        <input name="email" className="w-full border rounded p-3" placeholder="Email" required />
        <input name="password" type="password" className="w-full border rounded p-3" placeholder="Contraseña" required />
        <button className="w-full bg-accent text-white rounded p-3">Registrarme</button>
        {msg && (
          <p className={`text-sm ${msgType === 'error' ? 'text-red-600' : msgType === 'success' ? 'text-green-700' : 'text-slate-700'}`}>
            {msg}
          </p>
        )}
      </div>
    </form>
  );
}
