import { NextResponse } from 'next/server';import { env } from '@/lib/env';import { supabaseAdmin } from '@/lib/supabase';import { pointsForPrediction } from '@/lib/scoring';
async function recalc(matchId:string,rh:number,ra:number){const {data:preds}=await supabaseAdmin.from('predictions').select('*').eq('match_id',matchId); for(const p of preds||[]){const s=pointsForPrediction(p.home_goals,p.away_goals,rh,ra); await supabaseAdmin.from('predictions').update({points_awarded:s.points,exact_hit:s.exact,winner_hit:s.winner}).eq('id',p.id);} }
export async function POST(req:Request){const k=req.headers.get('x-admin-key'); if(k!==env.globalAdminKey) return NextResponse.json({error:'unauthorized'},{status:401});
 const res=await fetch('https://api.football-data.org/v4/competitions/WC/matches',{headers:{'X-Auth-Token':env.footballDataApiKey}}); const data=await res.json();
 for(const m of data.matches||[]){const status=m.status==='FINISHED'?'finalizado':m.status==='IN_PLAY'?'en_vivo':'programado'; const home=m.score?.fullTime?.home, away=m.score?.fullTime?.away;
 const {data:up}=await supabaseAdmin.from('matches').upsert({external_id:m.id,home_team:m.homeTeam?.name,away_team:m.awayTeam?.name,kickoff_at:m.utcDate,phase:m.stage,status,home_score:home,away_score:away},{onConflict:'external_id'}).select('*').single(); if(status==='finalizado'&&home!=null&&away!=null) await recalc(up.id,home,away);
 }
 return NextResponse.json({ok:true,count:data.matches?.length||0});}
