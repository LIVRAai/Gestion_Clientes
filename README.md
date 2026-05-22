# NextUp CRM

CRM SaaS moderno para pymes enfocado en ciclo de vida del cliente y recompra.

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase Auth + Postgres
- Deploy en Vercel

## Configuración local
1. Instala dependencias:
   ```bash
   npm install
   ```
2. Copia variables:
   ```bash
   cp .env.example .env.local
   ```
3. Carga `supabase/schema.sql` en el SQL Editor de Supabase.
4. Ejecuta:
   ```bash
   npm run dev
   ```

## Deploy en Vercel
1. Importa el repo en Vercel.
2. Agrega variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy automático.

## Rutas
- `/login`
- `/register`
- `/dashboard`
- `/clientes`
- `/productos`
- `/compras`
- `/analitica`
- `/pipeline`
- `/recompra`
- `/tareas`
