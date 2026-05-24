import { createClient } from '@supabase/supabase-js';
import { env } from './env';

const url = env.supabaseUrl || 'https://placeholder.supabase.co';
const anon = env.supabaseAnonKey || 'placeholder-key';
const service = env.serviceRole || anon;

export const supabase = createClient(url, anon);
export const supabaseAdmin = createClient(url, service);
