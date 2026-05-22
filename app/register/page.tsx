'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
  const [msg, setMsg] = useState('');
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email'));
    const password = String(fd.get('password'));
    const { error } = await supabase.auth.signUp({ email, password });
    setMsg(error ? error.message : 'Registro exitoso. Revisa tu correo para confirmar.');
  }
  return <form onSubmit={onSubmit} className="min-h-screen flex items-center justify-center"><div className="card p-8 w-full max-w-md space-y-4"><h1 className="text-2xl font-bold">Crear cuenta</h1><input name="email" className="w-full border rounded p-3" placeholder="Email" /><input name="password" type="password" className="w-full border rounded p-3" placeholder="Contraseña" /><button className="w-full bg-accent text-white rounded p-3">Registrarme</button>{msg && <p className="text-sm">{msg}</p>}</div></form>;
}
