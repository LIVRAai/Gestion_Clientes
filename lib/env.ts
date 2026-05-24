export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  serviceRole: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  footballDataApiKey: process.env.FOOTBALL_DATA_API_KEY ?? '',
  globalAdminKey: process.env.GLOBAL_ADMIN_KEY ?? ''
};
