import catalog from '../../../lib/places.json';
import { database, identity, json, allowWrite, blankState } from '../../../lib/store';
export async function GET(request: Request) {
  const user = identity(request); if (!user) return json({ error:'Sign in to save your trip.' },401);
  try {
    const row = await database().prepare('SELECT state, revision, updated_at FROM trip_plans WHERE user_id = ?').bind(user).first<{state:string,revision:number,updated_at:string}>();
    return json({ state: row ? JSON.parse(row.state) : blankState(), revision: row?.revision ?? 0, updatedAt: row?.updated_at ?? null, signedIn: true });
  } catch(error) { console.error('Load trip failed',error); return json({error:'Your trip could not be loaded. Please retry.'},503); }
}
export async function PUT(request: Request) {
  const user = identity(request); if (!user) return json({error:'Sign in to save your trip.'},401);
  if(!allowWrite(request)) return json({error:'Request not allowed.'},403);
  if(Number(request.headers.get('content-length')||0)>12000) return json({error:'Trip is too large.'},413);
  let body: any;
  try { const text = await request.text(); if(text.length>12000) return json({error:'Trip is too large.'},413); body=JSON.parse(text); } catch {return json({error:'Invalid trip data.'},400);}
  const state=body?.state; const ids=new Set(catalog.map(p=>p.id));
  const validList=(a: unknown)=>Array.isArray(a)&&a.length<=catalog.length&&a.every(id=>typeof id==='string'&&ids.has(id))&&new Set(a).size===a.length;
  if(!state || !validList(state.favorites)||!validList(state.stops)||typeof state.title!=='string'||!state.title.trim()||state.title.length>120||typeof state.notes!=='string'||state.notes.length>2000||typeof state.date!=='string'||(state.date!==''&&(!/^\d{4}-\d{2}-\d{2}$/.test(state.date)||!Number.isFinite(Date.parse(state.date))||new Date(state.date).toISOString().slice(0,10)!==state.date))||!Number.isInteger(body.revision)||body.revision<0) return json({error:'Check your trip title, date, and stops.'},400);
  const clean={favorites:state.favorites,stops:state.stops,title:state.title.trim(),date:state.date,notes:state.notes};
  try {
    const db=database(); const stamp=new Date().toISOString();
    const result=body.revision===0
      ? await db.prepare('INSERT OR IGNORE INTO trip_plans (user_id,state,revision,updated_at) VALUES (?,?,1,?)').bind(user,JSON.stringify(clean),stamp).run()
      : await db.prepare('UPDATE trip_plans SET state=?, revision=revision+1, updated_at=? WHERE user_id=? AND revision=?').bind(JSON.stringify(clean),stamp,user,body.revision).run();
    if(!result.meta.changes) return json({error:'Your trip changed in another tab. Reload your saved trip before saving again.'},409);
    return json({state:clean,revision:body.revision+1,updatedAt:stamp});
  } catch(error) { console.error('Save trip failed',error); return json({error:'Your changes were not saved. Please retry.'},503); }
}
