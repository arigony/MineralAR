import { MINERALS, CACHE_NAME, IS_MOBILE } from "./minerals.js";
import { parseMetadata, formatCell, formatAngles, citationText } from "./cif-meta.js";

const $ = id => document.getElementById(id);

const state = {
  mineral:null, text:"", filename:"", model:null, meta:null,
  arActive:false, stream:null, tracker:null, trackerPromise:null, detectTimer:null,
  lastHand:null, lastPinch:null
};

if (!globalThis.$3Dmol) throw new Error("3Dmol.js não foi carregado.");
const viewer = $3Dmol.createViewer("scene", { backgroundColor:"0xe8eee9", antialias:true });

function showLoading(message) {
  $("loadingText").textContent = message;
  $("loading").classList.remove("hidden");
}
function hideLoading() { $("loading").classList.add("hidden"); }
function setStatus(message,type="") {
  $("status").textContent = message;
  $("status").className = `status ${type}`.trim();
}
function toast(message,type="info") {
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.textContent = message;
  $("toastBox").appendChild(el);
  setTimeout(() => el.remove(),4500);
}
function setHandStatus(text,detected=false) {
  const el = $("handStatus");
  el.textContent = text;
  el.classList.remove("hidden");
  el.classList.toggle("detected",detected);
}
function infoItem(label,value,wide=false) {
  const wrapper = document.createElement("div");
  wrapper.className = `info-item${wide ? " wide" : ""}`;
  const span = document.createElement("span");
  span.textContent = label;
  const strong = document.createElement("strong");
  strong.textContent = value || "—";
  wrapper.append(span,strong);
  return wrapper;
}
function currentOptions() {
  return {
    representation:$("representation").value,
    showCell:$("showCell").checked,
    showBonds:$("showBonds").checked,
    repeat:Number($("supercell").value)
  };
}
function styleModel(model,options) {
  if (options.representation === "space-fill") {
    model.setStyle({}, { sphere:{ scale:1.0, colorscheme:"Jmol" } });
  } else if (options.representation === "wire") {
    model.setStyle({}, { line:{ linewidth:1.5, colorscheme:"Jmol" } });
  } else if (options.showBonds) {
    model.setStyle({}, {
      sphere:{ scale:.28, colorscheme:"Jmol" },
      stick:{ radius:.12, colorscheme:"Jmol" }
    });
  } else {
    model.setStyle({}, { sphere:{ scale:.32, colorscheme:"Jmol" } });
  }
}
function renderStructure() {
  if (!state.text) return;
  const options = currentOptions();
  viewer.removeAllModels();
  viewer.removeAllShapes();
  viewer.removeAllLabels();
  const model = viewer.addModel(state.text,"cif");
  if (!model) throw new Error("O CIF não pôde ser interpretado pelo 3Dmol.js.");
  if (options.repeat > 1) viewer.replicateUnitCell(options.repeat,options.repeat,options.repeat,model,true,false);
  styleModel(model,options);
  if (options.showCell) viewer.addUnitCell(model,{ box:{ color:"#1e6b5a" } });
  viewer.zoomTo();
  viewer.render();
  state.model = model;
  const atoms = model.selectedAtoms({}) || [];
  const bondCount = Math.round(atoms.reduce((sum,atom) => sum + (atom.bonds?.length || 0),0)/2);
  renderInfo(atoms.length,bondCount);
  return { atoms:atoms.length,bonds:bondCount };
}
function renderInfo(atomCount,bondCount) {
  const mineral = state.mineral;
  const meta = state.meta;
  $("mineralName").textContent = mineral?.name || meta.name || "Arquivo CIF";
  $("mineralFormula").textContent = mineral?.formula || meta.formula || "—";
  $("mineralMeta").textContent = `${mineral?.family || "Estrutura mineral"} · ${atomCount} átomos · ${bondCount} conexões`;
  $("teachingNote").textContent = mineral?.concept || "Estrutura fornecida pelo usuário. Interprete sua coordenação consultando a publicação original.";
  $("infoGrid").replaceChildren(
    infoItem("Classe",mineral?.family || "—"),
    infoItem("COD ID",meta.codId || "—"),
    infoItem("AMCSD",meta.amcsd || "—"),
    infoItem("Grupo espacial",meta.spaceGroup || "—"),
    infoItem("Nº do grupo",meta.groupNumber || "—"),
    infoItem("Z",meta.z || "—"),
    infoItem("Parâmetros",formatCell(meta.cell),true),
    infoItem("Ângulos",formatAngles(meta.cell),true),
    infoItem("Densidade",meta.density ? `${meta.density} g cm⁻³` : "—"),
    infoItem("Temperatura",meta.temperature ? `${meta.temperature} K` : "—")
  );
  const citation = citationText(meta);
  if (citation) {
    $("citationBox").textContent = `Referência estrutural: ${citation}`;
    $("citationBox").classList.remove("hidden");
  } else $("citationBox").classList.add("hidden");
  if (mineral?.sourceUrl) {
    $("sourceLink").href = mineral.sourceUrl;
    $("sourceLink").classList.remove("hidden");
  } else $("sourceLink").classList.add("hidden");
}
function processCIF(text,filename,mineral=null) {
  if (!/(^|\n)\s*data_/i.test(text) || !/_atom_site_fract_x/i.test(text)) {
    throw new Error("O arquivo não contém um CIF cristalográfico com coordenadas fracionárias.");
  }
  state.text = text;
  state.filename = filename;
  state.mineral = mineral;
  state.meta = parseMetadata(text);
  const counts = renderStructure();
  $("downloadCif").disabled = false;
  setStatus(`${mineral?.name || filename} carregado: ${counts.atoms} átomos na visualização.`,"success");
}
async function fetchWithTimeout(url,timeoutMs=15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(),timeoutMs);
  try {
    const response = await fetch(url,{ signal:controller.signal, mode:"cors", cache:"force-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } catch (error) {
    if (error?.name === "AbortError") throw new Error("Tempo limite de carregamento excedido.");
    throw error;
  } finally { clearTimeout(timer); }
}
async function getCIF(mineral) {
  if (globalThis.caches) {
    try {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(mineral.dataUrl);
      if (cached) return await cached.text();
      const text = await fetchWithTimeout(mineral.dataUrl);
      await cache.put(mineral.dataUrl,new Response(text,{ headers:{ "Content-Type":"chemical/x-cif" } }));
      return text;
    } catch (error) { console.warn("Cache indisponível:",error); }
  }
  return await fetchWithTimeout(mineral.dataUrl);
}
function setActiveCard(id="") {
  document.querySelectorAll(".mineral-card").forEach(card => {
    const active = card.dataset.id === id;
    card.classList.toggle("active",active);
    card.setAttribute("aria-pressed",active ? "true" : "false");
  });
}
async function loadMineral(mineral) {
  showLoading(`Carregando ${mineral.name}…`);
  setStatus(`Recuperando o CIF experimental de ${mineral.name}…`,"pending");
  setActiveCard(mineral.id);
  $("representation").value = mineral.representation;
  $("showBonds").checked = mineral.bonds;
  $("showCell").checked = true;
  $("supercell").value = String(mineral.supercell);
  try {
    processCIF(await getCIF(mineral),`${mineral.id}.cif`,mineral);
    toast(`${mineral.name} carregado.`,"success");
  } catch (error) {
    setActiveCard("");
    setStatus(`Não foi possível carregar ${mineral.name}: ${error.message}`,"error");
    toast(`Falha ao carregar ${mineral.name}.`,"error");
    console.error(error);
  } finally { hideLoading(); }
}
function renderGallery(filter="") {
  const query = filter.trim().toLocaleLowerCase("pt-BR");
  const matches = MINERALS.filter(m => `${m.name} ${m.formula} ${m.family} ${m.keywords}`.toLocaleLowerCase("pt-BR").includes(query));
  const fragment = document.createDocumentFragment();
  for (const mineral of matches) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "mineral-card";
    button.dataset.id = mineral.id;
    button.setAttribute("aria-pressed","false");
    const name = document.createElement("strong"); name.textContent = mineral.name;
    const formula = document.createElement("span"); formula.className = "formula"; formula.textContent = mineral.formula;
    const family = document.createElement("small"); family.textContent = mineral.family;
    button.append(name,formula,family);
    button.addEventListener("click",() => loadMineral(mineral));
    fragment.appendChild(button);
  }
  $("mineralGrid").replaceChildren(fragment);
  if (!matches.length) {
    const empty = document.createElement("p");
    empty.className = "intro";
    empty.textContent = "Nenhum mineral encontrado nesta coleção.";
    $("mineralGrid").appendChild(empty);
  }
  setActiveCard(state.mineral?.id || "");
}
async function handleFile(file) {
  if (!file) return;
  showLoading(`Abrindo ${file.name}…`);
  setActiveCard("");
  try {
    $("supercell").value = "1";
    processCIF(await file.text(),file.name,null);
    toast("Arquivo CIF carregado.","success");
  } catch (error) {
    setStatus(error.message,"error");
    toast(error.message,"error");
  } finally { hideLoading(); }
}

const video = $("cameraVideo");
function stopCamera() {
  if (state.stream) state.stream.getTracks().forEach(track => track.stop());
  state.stream = null;
  video.srcObject = null;
}
async function startCamera() {
  if (!window.isSecureContext) throw new Error("A realidade aumentada requer HTTPS.");
  if (!navigator.mediaDevices?.getUserMedia) throw new Error("Este navegador não oferece acesso à câmera.");
  stopCamera();
  state.stream = await navigator.mediaDevices.getUserMedia({
    audio:false,
    video:{ width:{ ideal:IS_MOBILE ? 640 : 960 }, height:{ ideal:IS_MOBILE ? 480 : 720 }, frameRate:{ ideal:24,max:30 } }
  });
  video.srcObject = state.stream;
  await video.play();
}
async function buildTracker() {
  if (state.tracker) return state.tracker;
  if (state.trackerPromise) return state.trackerPromise;
  state.trackerPromise = (async () => {
    const { HandLandmarker, FilesetResolver } = await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/vision_bundle.mjs");
    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/wasm");
    state.tracker = await HandLandmarker.createFromOptions(vision,{
      baseOptions:{
        modelAssetPath:"https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        delegate:"CPU"
      },
      runningMode:"VIDEO", numHands:1,
      minHandDetectionConfidence:.25, minHandPresenceConfidence:.25, minTrackingConfidence:.25
    });
    return state.tracker;
  })();
  try { return await state.trackerPromise; } finally { state.trackerPromise = null; }
}
function distance(a,b) { return Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z); }
function detectHand() {
  if (!state.arActive || !state.tracker || video.readyState < 2) return;
  try {
    const hand = state.tracker.detectForVideo(video,performance.now())?.landmarks?.[0];
    if (!hand) {
      state.lastHand = null; state.lastPinch = null;
      setHandStatus("Mostre a mão aberta ou use toque e mouse",false);
      return;
    }
    const center = {
      x:(hand[0].x+hand[5].x+hand[17].x)/3,
      y:(hand[0].y+hand[5].y+hand[17].y)/3
    };
    const pinch = distance(hand[4],hand[8]);
    if (state.lastHand) {
      viewer.rotate((center.x-state.lastHand.x)*260,"y");
      viewer.rotate((center.y-state.lastHand.y)*220,"x");
    }
    if (state.lastPinch && pinch < .18) {
      viewer.zoom(Math.max(.92,Math.min(1.08,pinch/state.lastPinch)));
    }
    state.lastHand = center;
    state.lastPinch = pinch;
    viewer.render();
    setHandStatus(pinch < .18 ? "Mão detectada — pinça controla o zoom" : "Mão detectada — mova para girar",true);
  } catch (error) {
    console.warn(error);
    setHandStatus("Rastreamento indisponível; use toque ou mouse",false);
  }
}
async function startAR() {
  if (state.arActive) return;
  if (!state.model) {
    toast("Selecione um mineral antes de iniciar o AR.","error");
    return;
  }
  showLoading("Iniciando câmera…");
  try {
    await startCamera();
    state.arActive = true;
    video.classList.add("ar-visible");
    document.body.classList.add("ar-active");
    viewer.setBackgroundColor(0x000000,0);
    viewer.render();
    $("galleryMode").classList.remove("active");
    $("arMode").classList.add("active");
    hideLoading();
    setStatus("AR ativo. Use a mão, o toque ou o mouse para manipular a estrutura.","success");
    setHandStatus("AR por toque ativo — carregando rastreamento de mãos…",false);
    buildTracker().then(() => {
      if (!state.arActive) return;
      clearInterval(state.detectTimer);
      state.detectTimer = setInterval(detectHand,IS_MOBILE ? 125 : 95);
      setHandStatus("Mostre a mão aberta ou use toque e mouse",false);
      toast("Rastreamento de mãos ativo.","success");
    }).catch(error => {
      console.error(error);
      if (state.arActive) setHandStatus("Rastreamento de mãos indisponível; toque e mouse continuam ativos",false);
    });
  } catch (error) {
    hideLoading();
    stopAR();
    const message = ["NotAllowedError","SecurityError"].includes(error?.name)
      ? "Autorize o uso da câmera nas permissões do navegador."
      : error.message || "Não foi possível iniciar a câmera.";
    setStatus(message,"error");
    toast(message,"error");
  }
}
function stopAR() {
  clearInterval(state.detectTimer);
  state.detectTimer = null;
  state.lastHand = null;
  state.lastPinch = null;
  stopCamera();
  video.classList.remove("ar-visible");
  document.body.classList.remove("ar-active");
  viewer.setBackgroundColor(0xe8eee9,1);
  viewer.render();
  state.arActive = false;
  $("galleryMode").classList.add("active");
  $("arMode").classList.remove("active");
  $("handStatus").classList.add("hidden");
}

$("mineralSearch").addEventListener("input",event => renderGallery(event.target.value));
for (const id of ["representation","supercell","showCell","showBonds"]) {
  $(id).addEventListener("change",() => {
    try {
      const counts = renderStructure();
      setStatus(`Visualização atualizada: ${counts.atoms} átomos.`,"success");
    } catch (error) {
      setStatus(error.message,"error");
      toast(error.message,"error");
    }
  });
}
$("resetView").addEventListener("click",() => {
  viewer.zoomTo();
  viewer.render();
});
$("cifFile").addEventListener("change",event => handleFile(event.target.files?.[0]));
$("downloadCif").addEventListener("click",() => {
  if (!state.text) return;
  const url = URL.createObjectURL(new Blob([state.text],{ type:"chemical/x-cif;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = state.filename || "mineral.cif";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url),1000);
});
$("collapseControls").addEventListener("click",() => {
  const panel = document.querySelector(".control-panel");
  const collapsed = panel.classList.toggle("collapsed");
  $("collapseControls").textContent = collapsed ? "+" : "−";
  setTimeout(() => viewer.resize(),250);
});
$("infoToggle").addEventListener("click",() => {
  const card = $("infoCard");
  const expanded = card.classList.toggle("expanded");
  card.classList.toggle("collapsed",!expanded);
  $("infoToggle").setAttribute("aria-expanded",expanded ? "true" : "false");
});
$("arMode").addEventListener("click",startAR);
$("galleryMode").addEventListener("click",stopAR);
addEventListener("mineralar-camera-change",() => {
  if (state.arActive) {
    stopAR();
    setTimeout(startAR,150);
  }
});
addEventListener("resize",() => viewer.resize());
addEventListener("beforeunload",stopCamera);
addEventListener("pagehide",stopCamera);

renderGallery();
loadMineral(MINERALS[0]);
