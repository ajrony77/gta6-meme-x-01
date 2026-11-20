// gta6-meme-x-01 — the entry is an X post, not code.
// This program's only job is to hand POST.json (the post's address) to
// the grader by writing it to /output. The house reads the post itself
// from X — its first picture and its text — and judges that.
// Nothing this file writes about the post is judged.
//
// Local check, the way the grader runs it:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(BOT_DIR, 'POST.json');
const target = join(OUTPUT_DIR, 'POST.json');

mkdirSync(OUTPUT_DIR, { recursive: true });

// Read the file once, check it names a post, then write the same bytes.
const bytes = readFileSync(source);
let post: unknown;
try {
  post = JSON.parse(bytes.toString('utf8'));
} catch (err) {
  console.error(`POST.json is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}
if (typeof post !== 'object' || post === null || typeof (post as { url?: unknown }).url !== 'string') {
  console.error('POST.json must be an object with a string "url" field');
  process.exit(1);
}
const url = (post as { url: string }).url;
if (!/^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\/[^/]+\/status\/\d+/.test(url) &&
    !/^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\/i\/web\/status\/\d+/.test(url)) {
  console.error(`POST.json url does not look like an X post address: ${url}`);
  process.exit(1);
}
writeFileSync(target, bytes);
