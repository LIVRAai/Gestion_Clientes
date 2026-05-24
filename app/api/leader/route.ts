import { NextResponse } from 'next/server';import { supabaseAdmin } from '@/lib/supabase';
export async function GET(){const {data}=await supabaseAdmin.from('matches').select('*').order('kickoff_at',{ascending:true}).limit(100); return NextResponse.json({matches:data||[]});}
