import { supabaseAdmin } from '@/lib/supabase';

export default async function Lider({params}:{params:{token:string}}){
 const {data:group}=await supabaseAdmin.from('groups').select('*').eq('admin_token',params.token).single();
 if(!group) return <main>Acceso inválido</main>;
 const [{data:participants},{data:payments}] = await Promise.all([
  supabaseAdmin.from('participants').select('*').eq('group_id',group.id),
  supabaseAdmin.from('payments').select('*').eq('group_id',group.id)
 ]);
 return <main className='p-4 max-w-3xl mx-auto'><h1 className='text-2xl font-bold'>Panel del líder</h1><p>Link público: /g/{group.public_token}</p><ul className='mt-4 space-y-2'>{(participants||[]).map((p:any)=>{const pay=(payments||[]).find((x:any)=>x.participant_id===p.id);return <li key={p.id} className='border p-2 rounded'>{p.name} - {pay?.status||'Pendiente'} - ref: {pay?.note||'-'}<form action='/api/payments' method='post' className='inline ml-2'><input type='hidden' name='participant_id' value={p.id}/><input type='hidden' name='group_id' value={group.id}/><select name='status'><option>Pendiente</option><option>Reportado</option><option>Confirmado</option></select><button className='ml-2 border px-2'>Actualizar</button></form></li>})}</ul></main>
}
