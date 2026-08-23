#!/usr/bin/env node

/**
 * audit-repos.mjs
 *
 * Fetches all public repos for the configured GitHub user and reports
 * which repos are missing enrichable metadata (description, topics, homepage).
 *
 * Usage:
 *   GITHUB_TOKEN=ghp_xxx node scripts/audit-repos.mjs
 *   node scripts/audit-repos.mjs
 *
 * Env vars:
 *   GITHUB_TOKEN  - optional but recommended (5 000 req/hr)
 *   GITHUB_USER   - override the target user (default: Hectormalvarez)
 */

const GITHUB_USER = process.env.GITHUB_USER || "Hectormalvarez";
const ENRICHABLE_FIELDS = ["description", "topics", "homepage"];

// ── Minimal .env loader (no dependencies) ───────────────────────────────────
// Reads the project .env if GITHUB_TOKEN is not already in the environment.

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

function loadDotEnv() {
  if (process.env.GITHUB_TOKEN) return; // already set
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const envPath = resolve(__dirname, "..", ".env");
  try {
    const lines = readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      // strip surrounding quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = val;
    }
  } catch {
    // .env not found — that's fine, proceed without it
  }
}
loadDotEnv();

function getHeaders() {
  const h = {
    Accept: "application/vnd.github+json",
    "User-Agent": "tmtn-audit-script",
  };
  if (process.env.GITHUB_TOKEN) {
    h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return h;
}

async function fetchAllRepos(user) {
  const repos = [];
  let page = 1;
  while (true) {
    const url = `https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&page=${page}&sort=updated&type=owner`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) {
      console.error(`\nX GitHub API error ${res.status}: ${res.statusText}`);
      if (res.status === 403) {
        console.error("  Hint: set GITHUB_TOKEN to raise the rate limit.");
      }
      process.exit(1);
    }
    const batch = await res.json();
    if (batch.length === 0) break;
    repos.push(...batch);
    page++;
  }
  return repos;
}

function analyzeRepo(repo) {
  const missing = [];
  if (!repo.description || repo.description.trim() === "") missing.push("description");
  if (!repo.topics || repo.topics.length === 0) missing.push("topics");
  if (!repo.homepage || repo.homepage.trim() === "") missing.push("homepage");
  return {
    name: repo.name,
    language: repo.language,
    fork: repo.fork,
    stars: repo.stargazers_count,
    pushed_at: repo.pushed_at,
    missing,
    score: 1 - missing.length / ENRICHABLE_FIELDS.length,
  };
}

const PAD = { name: 34, lang: 14, stars: 6, score: 6 };
function pad(str, len) { return String(str).padEnd(len); }
function scoreBar(score) {
  const filled = Math.round(score * 5);
  return "\u2588".repeat(filled) + "\u2591".repeat(5 - filled);
}

function printReport(results) {
  const sorted = [...results].sort((a, b) => a.score - b.score || a.name.localeCompare(b.name));

  console.log("\n+-- Repository Enrichment Audit ----------------------------------------+");
  console.log(`|  Target user: ${GITHUB_USER}`);
  console.log(`|  Repos scanned: ${results.length}`);
  console.log(`|  Enrichable fields: ${ENRICHABLE_FIELDS.join(", ")}`);
  console.log("+----------------------------------------------------------------------+");

  const hdr = [pad("Repository", PAD.name), pad("Language", PAD.lang), pad("Stars", PAD.stars), pad("Score", PAD.score), "Enrichment"].join("  ");
  console.log(`|  ${hdr}`);
  console.log("|  " + "-".repeat(hdr.length));

  for (const r of sorted) {
    const flag = r.missing.length === 0 ? "  [OK]" : "  [!!]";
    const row = [
      pad(r.name, PAD.name),
      pad(r.language ?? "--", PAD.lang),
      pad(String(r.stars), PAD.stars),
      pad(`${Math.round(r.score * 100)}%`, PAD.score),
      `${scoreBar(r.score)}${flag}`,
    ].join("  ");
    console.log(`|  ${row}`);
  }
  console.log("+----------------------------------------------------------------------+");

  const incomplete = sorted.filter((r) => r.missing.length > 0);
  if (incomplete.length === 0) {
    console.log("\n  All repos have full enrichment. Nothing to do!\n");
    return;
  }

  console.log(`\n+-- Missing Fields Detail (${incomplete.length} repos need enrichment) --------+\n`);
  for (const r of incomplete) {
    const tags = r.missing.map((f) => {
      if (f === "topics") return "topics (0)";
      if (f === "description") return "description (empty)";
      if (f === "homepage") return "homepage (empty)";
      return f;
    }).join(", ");
    console.log(`|  ${pad(r.name, PAD.name)}  ->  ${tags}`);
  }
  console.log("\n+----------------------------------------------------------------------+");

  console.log("\n  Next steps:\n");
  console.log("     1. Add topics via GitHub UI:  https://github.com/<owner>/<repo>/edit");
  console.log("     2. Add a description & homepage on the same settings page.");
  console.log("     3. Re-run this script to verify:  npm run audit:repos\n");

  const totalFields = results.length * ENRICHABLE_FIELDS.length;
  const filledFields = totalFields - incomplete.reduce((sum, r) => sum + r.missing.length, 0);
  const pct = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 100;
  console.log(`  Overall enrichment: ${filledFields}/${totalFields} fields filled (${pct}%)\n`);
}

async function main() {
  console.log(`\nFetching repos for ${GITHUB_USER}...`);
  const repos = await fetchAllRepos(GITHUB_USER);
  const results = repos.map(analyzeRepo);
  const needsWork = results.filter((r) => r.missing.length > 0).length;

  printReport(results);

  if (needsWork > 0) {
    console.log(`  WARNING: ${needsWork} repo(s) need enrichment. Exiting with code 1.`);
    process.exit(1);
  }
  console.log("  All repos fully enriched. Exiting cleanly.");
  process.exit(0);
}

main();
