import { env } from 'cloudflare:workers';
export function database() { if (!env.DB) throw new Error('Storage unavailable'); return env.DB; }
export function identity(request: Request) { return request.headers.get('oai-authenticated-user-id'); }
export function json(data: unknown, status = 200) { return Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } }); }
export function allowWrite(request: Request) {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}
export const blankState = () => ({ favorites: [] as string[], stops: [] as string[], title: 'My Tbilisi day', date: '', notes: '' });
