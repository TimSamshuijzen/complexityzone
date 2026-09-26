// Checks that the shared code blocks in src/arcade/*.html are identical in every game that has them.
//
// Shared blocks are delimited by comment lines containing
//   ==== BEGIN SHARED <name> ...   and   ==== END SHARED <name> ====
// Every game must contain arcade-shell.css and arcade-shell.js.
//
// Usage (from the repository root):
//   npx prettier@3.9.9 --write "src/arcade/*.html"
//   node tools/check-arcade.mjs

import { readdirSync, readFileSync } from "node:fs";

const directory = new URL("../src/arcade/", import.meta.url);
const required = ["arcade-shell.css", "arcade-shell.js"];
const pattern = /==== BEGIN SHARED (\S+?):?\s[^\n]*\n([\s\S]*?)\n[^\n]*==== END SHARED \1 ====/g;

const files = readdirSync(directory).filter((name) => name.endsWith(".html") && name !== "index.html");
const blocks = new Map();
let failed = false;

for (const file of files) {
  const text = readFileSync(new URL(file, directory), "utf8").replace(/\r\n/g, "\n");
  const found = new Set();
  for (const [, name, body] of text.matchAll(pattern)) {
    found.add(name);
    if (!blocks.has(name)) blocks.set(name, []);
    blocks.get(name).push({ file, body });
  }
  for (const name of required) {
    if (!found.has(name)) {
      console.error(`${file}: missing shared block ${name}`);
      failed = true;
    }
  }
}

for (const [name, copies] of blocks) {
  const [reference, ...others] = copies;
  let identical = true;
  for (const copy of others) {
    if (copy.body === reference.body) continue;
    const a = reference.body.split("\n");
    const b = copy.body.split("\n");
    const line = a.findIndex((text, index) => text !== b[index]);
    console.error(`${name}: ${copy.file} differs from ${reference.file} at block line ${line + 1}`);
    console.error(`  ${reference.file}: ${a[line] ?? "(end of block)"}`);
    console.error(`  ${copy.file}: ${b[line] ?? "(end of block)"}`);
    identical = false;
    failed = true;
  }
  if (identical) console.log(`${name}: identical in ${copies.map((copy) => copy.file).join(", ")}`);
}

process.exitCode = failed ? 1 : 0;
