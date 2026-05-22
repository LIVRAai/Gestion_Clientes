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
3. Carga `supabase/schema.sql` en el SQL Editor de Supabase (**Run** completo).
4. Ejecuta:
   ```bash
   npm run dev
   ```

## Crear tablas en Supabase (paso obligatorio)
Si en **Table Editor** ves `No tables created yet`, debes ejecutar el schema manualmente:

1. Abre tu proyecto correcto en Supabase.
2. Ve a **SQL Editor** → **New query**.
3. Copia y pega **todo** el contenido de `supabase/schema.sql`.
4. Presiona **Run**.
5. Verifica con esta consulta:
   ```sql
   select table_name
   from information_schema.tables
   where table_schema = 'public'
   order by table_name;
   ```

Debe listar al menos:
- `clientes`
- `productos`
- `compras`
- `tareas`
- `historial_acciones`

Si no aparecen:
- confirma que estás en el proyecto correcto,
- revisa errores en la salida del SQL Editor,
- vuelve a ejecutar el script completo (es idempotente).

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
