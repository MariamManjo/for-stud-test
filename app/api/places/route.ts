import catalog from '../../../lib/places.json';
import { database, json } from '../../../lib/store';
export async function GET() {
  try {
    const db = database();
    await db.batch(catalog.map(p => db.prepare('INSERT OR IGNORE INTO place_catalog (id, content) VALUES (?, ?)').bind(p.id, JSON.stringify(p))));
    const result = await db.prepare('SELECT content FROM place_catalog ORDER BY rowid').all<{content:string}>();
    return json({ places: result.results.map(row => JSON.parse(row.content)) });
  } catch(error) { console.error('Catalog unavailable', error); return json({ error: 'Places could not be loaded. Please retry.' }, 503); }
}
