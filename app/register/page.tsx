'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
  const router = useRouter();
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'error' | 'success' | 'info'>('info');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email'));
    const password = String(fd.get('password'));

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setMsgType('error');
      setMsg(error.message);
      return;
    }

    if (data.session) {
      setMsgType('success');
      setMsg('Registro exitoso. Redirigiendo al dashboard...');
      router.push('/dashboard');
      return;
    }

    setMsgType('info');
    setMsg('Registro completado, pero no se creó sesión automáticamente. Inicia sesión para continuar.');
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
