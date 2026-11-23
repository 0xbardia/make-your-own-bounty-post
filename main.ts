// Entry for make.fun's "Promote make.fun's make-your-own-bounty post on X".
// The post on X is the entry; this program only hands its address to the grader
// by copying POST.json into the output directory, byte for byte.
// Node 22, standard library only, no network: the same input gives the same output.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_BYTES = 16384;
const POST_URL = /^https:\/\/(?:www\.|mobile\.)?(?:x|twitter)\.com\/[A-Za-z0-9_]{1,15}\/status\/\d+$/;

const botDir = process.env.MAKEFUN_BOT_DIR ?? ".";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const raw = readFileSync(join(botDir, "POST.json"));

// Fail loudly here rather than hand the grader a file its scorer would reject.
function check(bytes: Buffer): void {
  if (bytes.length > MAX_BYTES) {
    throw new Error(`POST.json is ${bytes.length} bytes; the limit is ${MAX_BYTES}`);
  }
  const post: unknown = JSON.parse(bytes.toString("utf8"));
  if (post === null || typeof post !== "object" || Array.isArray(post)) {
    throw new Error("POST.json must hold a JSON object");
  }
  const url = (post as { url?: unknown }).url;
  if (typeof url !== "string" || !POST_URL.test(url)) {
    throw new Error(`POST.json url is not an X post address: ${String(url)}`);
  }
}

check(raw);
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "POST.json"), raw);
