import assert from "node:assert/strict";

const commit = "7adea78a682c1fa793825c85e67de531005413ff";
const base = `https://cdn.jsdelivr.net/gh/OpenChemistry/crystals@${commit}`;
const sources = [
  ["halite", `${base}/halides/NaCl-Halite.cif`],
  ["fluorite", `${base}/halides/CaF2-Fluorite.cif`],
  ["quartz", `${base}/oxides/SiO2-Quartz-alpha.cif`],
  ["calcite", `${base}/carbonates/CaCO3-Calcite.cif`],
  ["corundum", `${base}/oxides/Al2O3-Corundum.cif`],
  ["hematite", `${base}/oxides/Fe2O3-Hematite.cif`],
  ["magnetite", `${base}/oxides/Fe3O4-Magnetite.cif`],
  ["forsterite", "https://cdn.jsdelivr.net/gh/JohnKendrick/PDielec@13fd4dad0a93712c19ef566a384c000a80f4ef07/Examples/Experiment/Forsterite/9000534.cif"],
  ["kaolinite", `${base}/clays/Al2Si2O9H4-Kaolinite.cif`],
  ["gypsum", `${base}/sulfates/CaSO4-2(H2O)-Gypsum.cif`]
];

for (const [name, url] of sources) {
  const response = await fetch(url, { headers: { Origin: "https://arigony.github.io" } });
  assert.equal(response.ok, true, `${name}: HTTP ${response.status}`);
  const allowOrigin = response.headers.get("access-control-allow-origin");
  assert.ok(allowOrigin === "*" || allowOrigin === "https://arigony.github.io", `${name}: CORS ausente`);
  const text = await response.text();
  assert.match(text, /(^|\n)\s*data_/i, `${name}: bloco data_ ausente`);
  assert.match(text, /_cell_length_a/i, `${name}: cela ausente`);
  assert.match(text, /_atom_site_fract_x/i, `${name}: coordenadas ausentes`);
  console.log(`${name}: PASS (${text.length} caracteres)`);
}
