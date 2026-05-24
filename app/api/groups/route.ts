import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
export async function POST(req:Request){const body=await req.json();const {data,error}=await supabaseAdmin.from('groups').insert(body).select('*').single(); if(error) return NextResponse.json({error:error.message},{status:400}); const base=process.env.NEXT_PUBLIC_BASE_URL||'http://localhost:3000'; return NextResponse.json({group:data,publicUrl:`${base}/g/${data.public_token}`,adminUrl:`${base}/lider/${data.admin_token}`});}
