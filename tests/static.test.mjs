import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const app = await readFile(new URL("../src/app.js", import.meta.url), "utf8");
const minerals = await readFile(new URL("../src/minerals.js", import.meta.url), "utf8");
const css = await readFile(new URL("../style.css", import.meta.url), "utf8");

test("interface contém elementos essenciais", () => {
  for (const id of ["scene", "mineralGrid", "representation", "supercell", "arMode", "infoCard"]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(app, /const \$ = id => document\.getElementById\(id\)/);
});

test("coleção inicial contém dez minerais", () => {
  const ids = ["halite", "fluorite", "quartz", "calcite", "corundum", "hematite", "magnetite", "forsterite", "kaolinite", "gypsum"];
  for (const id of ids) assert.match(minerals, new RegExp(`id:\\s*"${id}"`));
  assert.equal((minerals.match(/\bid:\s*"/g) || []).length, 10);
});

test("URLs estruturais estão fixadas por commit", () => {
  assert.match(minerals, /7adea78a682c1fa793825c85e67de531005413ff/);
  assert.match(minerals, /13fd4dad0a93712c19ef566a384c000a80f4ef07/);
  assert.doesNotMatch(minerals, /@master|@main\/|raw\.githubusercontent\.com\/[^/]+\/[^/]+\/(?:main|master)\//);
});

test("CSS possui layouts responsivos", () => {
  assert.match(css, /@media \(max-width: 920px\)/);
  assert.match(css, /@media \(max-width: 540px\)/);
});
