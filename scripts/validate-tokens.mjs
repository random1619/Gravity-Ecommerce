#!/usr/bin/env node
/**
 * validate-tokens.mjs
 * Enforces the design-system rule: components must consume CSS custom
 * properties (tokens) instead of hardcoded hex colors.
 *
 * Scans *.module.css and *.scss under src/. Raw hex colors are flagged.
 * Allow-listed files (token definitions & fallbacks) are skipped:
 *   - src/app/globals.css     (token source of truth)
 *   - src/app/variables.scss  (SCSS fallbacks that reference var(--*) with hex defaults)
 *
 * Hex inside a var(--token, #fallback) fallback is permitted (it pairs with a token).
 * Usage: node scripts/validate-tokens.mjs   (exit 1 on violations)
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(ROOT, 'src');

const ALLOW_LIST = new Set([
    'src/app/globals.css',
    'src/app/variables.scss',
]);

const HEX_RE = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
const FILE_RE = /\.(module\.css|scss)$/;

/** Recursively collect matching files. */
function walk(dir, out = []) {
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) {
            if (entry === 'node_modules' || entry.startsWith('.')) continue;
            walk(full, out);
        } else if (FILE_RE.test(entry)) {
            out.push(full);
        }
    }
    return out;
}

/** A hex is allowed if it appears as a fallback inside var(--x, #hex). */
function lineViolations(line) {
    const bad = [];
    // Strip out var(...) fallbacks so their hex defaults aren't flagged.
    const withoutVarFallbacks = line.replace(/var\(\s*--[\w-]+\s*,[^)]*\)/g, '');
    let m;
    HEX_RE.lastIndex = 0;
    while ((m = HEX_RE.exec(withoutVarFallbacks)) !== null) {
        bad.push(m[0]);
    }
    return bad;
}

const files = walk(SRC);
let violationCount = 0;
const report = [];

for (const file of files) {
    const rel = relative(ROOT, file).replace(/\\/g, '/');
    if (ALLOW_LIST.has(rel)) continue;

    const lines = readFileSync(file, 'utf8').split(/\r?\n/);
    lines.forEach((line, i) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;
        // Lines explicitly marked as exempt (e.g. functional true-white for blend modes).
        if (line.includes('token-exempt')) return;
        const hits = lineViolations(line);
        if (hits.length) {
            violationCount += hits.length;
            report.push(`  ${rel}:${i + 1}  ${hits.join(', ')}`);
        }
    });
}

if (violationCount > 0) {
    console.error(`\n✗ Token validation failed — ${violationCount} hardcoded hex color(s) found.\n`);
    console.error('Use CSS custom properties (var(--*)) from globals.css instead:\n');
    console.error(report.join('\n'));
    console.error('');
    process.exit(1);
} else {
    console.log(`✓ Token validation passed — no hardcoded hex in ${files.length} scanned file(s).`);
}
