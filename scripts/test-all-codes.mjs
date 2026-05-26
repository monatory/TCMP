// 16개 코드 모두 codes.json에 존재하는지, 필드가 빠짐없는지 확인
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const codes = JSON.parse(readFileSync(join(root, 'data/codes.json'), 'utf8'));

const LIGHT = { 1: 'M', 2: 'E', 3: 'G', 4: 'C' };
const DARK = { 1: 'R', 2: 'H', 3: 'F', 4: 'I' };

const required = ['code', 'zone', 'nickname', 'english', 'tagline', 'coordinate', 'strength', 'shadow', 'wallStance', 'prescription'];

let missing = 0;
let badField = 0;
for (let m = 0; m < 2; m++)
for (let e = 0; e < 2; e++)
for (let g = 0; g < 2; g++)
for (let c = 0; c < 2; c++) {
  const code =
    (m ? LIGHT[1] : DARK[1]) +
    (e ? LIGHT[2] : DARK[2]) +
    (g ? LIGHT[3] : DARK[3]) +
    (c ? LIGHT[4] : DARK[4]);
  const data = codes[code];
  if (!data) { console.log('MISSING:', code); missing++; continue; }
  for (const f of required) {
    if (!data[f] || (typeof data[f] === 'string' && !data[f].trim())) {
      console.log('EMPTY FIELD:', code, f);
      badField++;
    }
  }
}
console.log(`16 codes check: missing=${missing}, emptyFields=${badField}`);
process.exit(missing + badField === 0 ? 0 : 1);
