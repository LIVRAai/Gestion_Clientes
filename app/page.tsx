import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="card max-w-xl p-10 text-center space-y-5">
        <h1 className="text-4xl font-bold">NextUp CRM</h1>
        <p className="text-slate-600">Un CRM premium para activar recompra y crecimiento en pymes.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/login" className="bg-accent text-white px-5 py-3 rounded-xl">Iniciar sesión</Link>
          <Link href="/register" className="border border-accent text-accent px-5 py-3 rounded-xl">Crear cuenta</Link>
        </div>
      </div>
    </div>
  );
}
