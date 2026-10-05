import { readFile, writeFile } from 'node:fs/promises';
const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
const expected = `const documentHtml = ${JSON.stringify(html)};\nexport default documentHtml;\n`;
const target = new URL('../lib/document.ts', import.meta.url);
if (process.argv.includes('--check')) {
  const current = await readFile(target, 'utf8');
  // The original generated source may escape Unicode; compare the string value.
  const match = current.match(/^const documentHtml = ([\s\S]*);\nexport default documentHtml;\n$/);
  if (!match || JSON.parse(match[1]) !== html) {
    console.error('HTML is out of sync. Run npm run sync:html.');
    process.exitCode = 1;
  } else console.log('HTML source is synchronized.');
} else {
  await writeFile(target, expected);
  console.log('Updated lib/document.ts from public/index.html.');
}
