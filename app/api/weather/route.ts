import { json } from '../../../lib/store';
let cached: {value:unknown, until:number} | null=null;
export async function GET() {
  if(cached&&cached.until>Date.now()) return json(cached.value);
  try {
    const response=await fetch('https://api.open-meteo.com/v1/forecast?latitude=41.7151&longitude=44.8271&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=3&timezone=Asia%2FTbilisi',{signal:AbortSignal.timeout(8000)});
    if(!response.ok) throw new Error('Weather provider error');
    const data:any=await response.json();
    if(!Number.isFinite(data.current?.temperature_2m)||!Array.isArray(data.daily?.time))throw new Error('Invalid weather');
    const value={current:data.current,daily:data.daily,timezone:data.timezone,fetchedAt:new Date().toISOString()};cached={value,until:Date.now()+600000};return json(value);
  } catch(error) { console.error('Weather unavailable',error);return json({error:'Weather is unavailable right now.'},503); }
}
