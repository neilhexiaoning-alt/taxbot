import { readdirSync } from 'fs';
import { join } from 'path';

const extSrc = 'd:/ai/clawd/openclaw2/extensions';
const extDst = 'd:/ai/clawd/openclaw2/taxbot-dist/extensions';

const dirs = readdirSync(extSrc, { withFileTypes: true }).filter(d => d.isDirectory());
for (const d of dirs) {
  const srcFiles = readdirSync(join(extSrc, d.name)).filter(f => f.endsWith('.ts') || f.endsWith('.js'));
  let dstFiles = [];
  try {
    dstFiles = readdirSync(join(extDst, d.name)).filter(f => f.endsWith('.ts') || f.endsWith('.js'));
  } catch (e) { /* dir missing */ }
  const missing = srcFiles.filter(f => !dstFiles.includes(f));
  if (missing.length > 0) console.log(`${d.name}: missing ${missing.join(', ')}`);
}
console.log('Done.');
