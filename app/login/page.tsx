'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

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

  return <form onSubmit={onSubmit} className="min-h-screen flex items-center justify-center"><div className="card p-8 w-full max-w-md space-y-4"><h1 className="text-2xl font-bold">Inicia sesión</h1><input className="w-full border rounded p-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required /><input className="w-full border rounded p-3" placeholder="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} required /><button className="w-full bg-accent text-white rounded p-3">Entrar</button>{error && <p className="text-red-600 text-sm">{error}</p>}{msg && <p className="text-green-700 text-sm">{msg}</p>}</div></form>;
}
