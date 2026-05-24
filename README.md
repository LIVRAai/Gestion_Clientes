# El Parche

App web para organizar parches del Mundial entre amigos en Colombia. **No procesa dinero**; solo muestra datos de pago y controla estados manuales.

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase
- Deploy en Vercel

## Instalación
1. `npm install`
2. Copie `.env.example` a `.env.local` y complete variables.
3. Ejecute SQL de `supabase/schema.sql` en Supabase.
4. `npm run dev`

## Variables de entorno
- `NEXT_PUBLIC_BASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `FOOTBALL_DATA_API_KEY`
- `GLOBAL_ADMIN_KEY`

## Rutas principales
- `/` Landing
- `/crear` Crear parche
- `/g/[token]` Vista pública
- `/lider/[token]` Panel del líder
- `/admin-global` Panel admin global

## Deploy Vercel
1. Importe el repo en Vercel.
2. Configure variables de entorno.
3. Deploy.

## Nota legal
La app NO recibe, custodia, mueve ni procesa dinero de terceros.
