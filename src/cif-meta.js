function cleanCIFValue(value) {
  const text = String(value || "").trim().replace(/^['"]|['"]$/g,"");
  return ["?","."].includes(text) ? "" : text;
}

function scalar(text,tag) {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  return cleanCIFValue(text.match(new RegExp(`^\\s*${escaped}\\s+(.+)$`,"mi"))?.[1] || "");
}

function multilineScalar(text,tag) {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  const multi = text.match(new RegExp(`^\\s*${escaped}\\s*\\n;\\s*\\n?([\\s\\S]*?)\\n;`,"mi"))?.[1];
  return cleanCIFValue(multi || scalar(text,tag)).replace(/\s+/g," ").trim();
}

function authorNames(text) {
  const block = text.match(/loop_\s+_publ_author_name\s+([\s\S]*?)(?=\n(?:loop_|_[A-Za-z]|data_|$))/i)?.[1] || "";
  return [...block.matchAll(/'([^']+)'|"([^"]+)"|([^\s#]+)/g)]
    .map(match => cleanCIFValue(match[1] || match[2] || match[3]))
    .filter(Boolean).join("; ");
}

function numericValue(value) {
  const match = String(value || "").match(/^[-+]?(?:\d+\.?\d*|\.\d+)/);
  return match ? Number(match[0]) : NaN;
}

export function parseMetadata(text) {
  return {
    codId:scalar(text,"_cod_database_code") || scalar(text,"_cod_database_code_structure"),
    amcsd:scalar(text,"_database_code_amcsd"),
    name:scalar(text,"_chemical_name_mineral") || scalar(text,"_chemical_name_common"),
    formula:scalar(text,"_chemical_formula_sum") || scalar(text,"_chemical_formula_structural"),
    spaceGroup:scalar(text,"_space_group_name_H-M_alt") || scalar(text,"_symmetry_space_group_name_H-M") || scalar(text,"_space_group_name_Hall"),
    groupNumber:scalar(text,"_space_group_IT_number") || scalar(text,"_symmetry_Int_Tables_number"),
    z:scalar(text,"_cell_formula_units_Z"),
    density:scalar(text,"_exptl_crystal_density_diffrn") || scalar(text,"_exptl_crystal_density_meas"),
    temperature:scalar(text,"_diffrn_ambient_temperature") || scalar(text,"_cell_measurement_temperature"),
    cell:{
      a:numericValue(scalar(text,"_cell_length_a")),
      b:numericValue(scalar(text,"_cell_length_b")),
      c:numericValue(scalar(text,"_cell_length_c")),
      alpha:numericValue(scalar(text,"_cell_angle_alpha")),
      beta:numericValue(scalar(text,"_cell_angle_beta")),
      gamma:numericValue(scalar(text,"_cell_angle_gamma"))
    },
    title:multilineScalar(text,"_publ_section_title"),
    authors:authorNames(text),
    journal:scalar(text,"_journal_name_full") || scalar(text,"_journal_name_abbrev"),
    year:scalar(text,"_journal_year"),
    volume:scalar(text,"_journal_volume"),
    pages:[scalar(text,"_journal_page_first"),scalar(text,"_journal_page_last")].filter(Boolean).join("–"),
    doi:scalar(text,"_journal_paper_doi")
  };
}

export function formatCell(cell) {
  const values = [cell.a,cell.b,cell.c];
  return values.every(Number.isFinite)
    ? `a ${cell.a.toFixed(3)} · b ${cell.b.toFixed(3)} · c ${cell.c.toFixed(3)} Å`
    : "—";
}

export function formatAngles(cell) {
  const values = [cell.alpha,cell.beta,cell.gamma];
  return values.every(Number.isFinite)
    ? `α ${cell.alpha.toFixed(2)}° · β ${cell.beta.toFixed(2)}° · γ ${cell.gamma.toFixed(2)}°`
    : "—";
}

export function citationText(meta) {
  const parts = [];
  if (meta.authors) parts.push(meta.authors);
  if (meta.title) parts.push(meta.title);
  const publication = [meta.journal,meta.year,meta.volume,meta.pages].filter(Boolean).join(", ");
  if (publication) parts.push(publication);
  if (meta.doi) parts.push(`DOI: ${meta.doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i,"")}`);
  return parts.join(". ");
}
