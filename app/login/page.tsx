'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setError(error.message);
    router.push('/dashboard');
  }

  return <form onSubmit={onSubmit} className="min-h-screen flex items-center justify-center"><div className="card p-8 w-full max-w-md space-y-4"><h1 className="text-2xl font-bold">Inicia sesión</h1><input className="w-full border rounded p-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /><input className="w-full border rounded p-3" placeholder="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} /><button className="w-full bg-accent text-white rounded p-3">Entrar</button>{error && <p className="text-red-600 text-sm">{error}</p>}</div></form>;
}
