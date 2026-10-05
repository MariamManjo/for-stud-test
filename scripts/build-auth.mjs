import { build } from 'esbuild';
await build({entryPoints:['browser/supabase.js'],outfile:'public/supabase-client.js',bundle:true,format:'esm',platform:'browser',minify:true});
