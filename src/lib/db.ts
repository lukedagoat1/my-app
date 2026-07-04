import { promises as fs } from "fs";
import path from "path";

// Durable JSON store. Production: commits to the `data` branch of this repo via
// the GitHub Contents API (survives serverless restarts, versioned, free).
// Dev / no GITHUB_TOKEN: falls back to local files in src/data/.
// Vercel deploys are disabled for the `data` branch (see vercel.json).

const REPO = process.env.DATA_REPO ?? "lukedagoat1/my-app";
const BRANCH = "data";
const API = `https://api.github.com/repos/${REPO}/contents`;

function token() {
  return process.env.GITHUB_TOKEN;
}

function localPath(name: string) {
  return path.join(process.cwd(), "src", "data", `${name}.json`);
}

function ghHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${token()}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "saras-trading-post",
  };
}

// ponytail: per-lambda in-memory cache, 30s. Fine for a small store; move to
// KV if traffic ever makes stale reads a real problem.
const cache = new Map<string, { t: number; v: unknown }>();
const TTL = 30_000;

// fresh=true bypasses all caches (needed for write sha lookups; only legal in
// dynamic contexts like API routes). Default: 30s ISR cache, safe inside
// statically-generated pages (e.g. on-demand /product/[id] for new listings).
async function ghGet(filePath: string, fresh = false): Promise<{ content: string; sha: string } | null> {
  const res = await fetch(`${API}/${filePath}?ref=${BRANCH}`, {
    headers: ghHeaders(),
    ...(fresh ? { cache: "no-store" as const } : { next: { revalidate: 30 } }),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub read ${filePath}: ${res.status}`);
  const data = (await res.json()) as { content: string; sha: string };
  return { content: Buffer.from(data.content, "base64").toString("utf-8"), sha: data.sha };
}

async function ghPut(filePath: string, content: string | Buffer, message: string): Promise<void> {
  const existing = await ghGet(filePath, true).catch(() => null);
  const body = {
    message,
    branch: BRANCH,
    content: Buffer.isBuffer(content) ? content.toString("base64") : Buffer.from(content).toString("base64"),
    ...(existing ? { sha: existing.sha } : {}),
  };
  const res = await fetch(`${API}/${filePath}`, { method: "PUT", headers: ghHeaders(), body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`GitHub write ${filePath}: ${res.status} ${await res.text()}`);
}

export async function readJson<T>(name: string, fallback: T, opts?: { fresh?: boolean }): Promise<T> {
  if (!token()) {
    try {
      return JSON.parse(await fs.readFile(localPath(name), "utf-8")) as T;
    } catch {
      return fallback;
    }
  }
  const key = `store/${name}.json`;
  if (!opts?.fresh) {
    const hit = cache.get(key);
    if (hit && Date.now() - hit.t < TTL) return hit.v as T;
  }
  try {
    const file = await ghGet(key, opts?.fresh);
    const v = file ? (JSON.parse(file.content) as T) : fallback;
    cache.set(key, { t: Date.now(), v });
    return v;
  } catch {
    const hit = cache.get(key);
    return hit ? (hit.v as T) : fallback;
  }
}

export async function writeJson(name: string, data: unknown): Promise<void> {
  if (!token()) {
    await fs.mkdir(path.dirname(localPath(name)), { recursive: true });
    await fs.writeFile(localPath(name), JSON.stringify(data, null, 2), "utf-8");
    return;
  }
  const key = `store/${name}.json`;
  // ponytail: one retry on write conflict; concurrent admin saves are rare.
  try {
    await ghPut(key, JSON.stringify(data, null, 2), `admin: update ${name}`);
  } catch {
    await ghPut(key, JSON.stringify(data, null, 2), `admin: update ${name} (retry)`);
  }
  cache.set(key, { t: Date.now(), v: data });
}

/** Upload an image (or any binary) to the data branch. Returns a public raw URL. */
export async function uploadFile(fileName: string, base64: string): Promise<string> {
  const safe = fileName.toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
  const key = `img/${Date.now()}-${safe}`;
  if (!token()) {
    const p = path.join(process.cwd(), "public", "uploads", `${Date.now()}-${safe}`);
    await fs.mkdir(path.dirname(p), { recursive: true });
    await fs.writeFile(p, Buffer.from(base64, "base64"));
    return `/uploads/${path.basename(p)}`;
  }
  await ghPut(key, Buffer.from(base64, "base64"), `admin: upload ${safe}`);
  return `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${key}`;
}
