import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';

async function getData(token:string){
 const {data:group}=await supabaseAdmin.from('groups').select('*').eq('public_token',token).single();
 if(!group) return null;
 const [{data:matches},{data:participants},{data:payments},{data:preds}] = await Promise.all([
  supabaseAdmin.from('matches').select('*').order('kickoff_at',{ascending:true}).limit(20),
  supabaseAdmin.from('participants').select('*').eq('group_id',group.id),
  supabaseAdmin.from('payments').select('*').eq('group_id',group.id),
  supabaseAdmin.from('predictions').select('*').eq('group_id',group.id)
 ]);
 return {group,matches:matches||[],participants:participants||[],payments:payments||[],preds:preds||[]};
}

export default async function Page({params}:{params:{token:string}}){const data=await getData(params.token); if(!data) return <main>Grupo no existe</main>; const ranking=data.participants.map((p:any)=>{const ps=data.preds.filter((x:any)=>x.participant_id===p.id); return {...p,points:ps.reduce((a:number,b:any)=>a+b.points_awarded,0),exact:ps.filter((x:any)=>x.exact_hit).length,winner:ps.filter((x:any)=>x.winner_hit).length,payment:data.payments.find((x:any)=>x.participant_id===p.id)?.status||'Pendiente'}}).sort((a,b)=>b.points-a.points);
 return <main className='p-4 max-w-4xl mx-auto'><h1 className='text-2xl font-bold'>{data.group.name}</h1><p>El líder del parche: {data.group.leader_name}</p><p>{data.group.payment_method}: {data.group.payment_account} · ${data.group.value_per_person}</p><a target='_blank' href={`https://wa.me/?text=${encodeURIComponent(`Parce, ya armamos el parche del Mundial. Métase, ponga marcador y no quede de último 👇 ${process.env.NEXT_PUBLIC_BASE_URL || ''}/g/${params.token}`)}`}>Compartir por WhatsApp</a><h2 className='mt-4 font-bold'>Tabla</h2><ul>{ranking.map((r,i)=><li key={r.id}>{i+1}. {r.name} - {r.points} pts ({r.payment})</li>)}</ul><Link className='underline block mt-4' href={`/lider/${data.group.admin_token}`}>Panel líder</Link></main>}
