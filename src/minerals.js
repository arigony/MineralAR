const OC_COMMIT = "7adea78a682c1fa793825c85e67de531005413ff";
const OC_CDN = `https://cdn.jsdelivr.net/gh/OpenChemistry/crystals@${OC_COMMIT}`;
const OC_GH = `https://github.com/OpenChemistry/crystals/blob/${OC_COMMIT}`;
const FORSTERITE_COMMIT = "13fd4dad0a93712c19ef566a384c000a80f4ef07";

export const CACHE_NAME = "mineralar-cif-v1";
export const IS_MOBILE = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || innerWidth < 780;

export const MINERALS = [
  {
    id:"halite", name:"Halita", formula:"NaCl", family:"Haleto",
    dataUrl:`${OC_CDN}/halides/NaCl-Halite.cif`,
    sourceUrl:`${OC_GH}/halides/NaCl-Halite.cif`,
    concept:"Estrutura sal-gema. Cada Na⁺ é coordenado por seis Cl⁻ e cada Cl⁻ por seis Na⁺: coordenação 6:6.",
    keywords:"sal gema cloreto sodio haleto cubico coordenação",
    representation:"space-fill", bonds:false, supercell:2
  },
  {
    id:"fluorite", name:"Fluorita", formula:"CaF₂", family:"Haleto",
    dataUrl:`${OC_CDN}/halides/CaF2-Fluorite.cif`,
    sourceUrl:`${OC_GH}/halides/CaF2-Fluorite.cif`,
    concept:"Estrutura fluorita. Cada Ca²⁺ possui oito F⁻ vizinhos; cada F⁻ ocupa um ambiente tetraédrico de quatro Ca²⁺.",
    keywords:"fluoreto calcio haleto cubico coordenação",
    representation:"space-fill", bonds:false, supercell:2
  },
  {
    id:"quartz", name:"Quartzo α", formula:"SiO₂", family:"Tectossilicato",
    dataUrl:`${OC_CDN}/oxides/SiO2-Quartz-alpha.cif`,
    sourceUrl:`${OC_GH}/oxides/SiO2-Quartz-alpha.cif`,
    concept:"Rede tridimensional de tetraedros SiO₄ compartilhando vértices. A estrutura do quartzo α é quiral.",
    keywords:"silica tectossilicato tetraedro rede trigonal",
    representation:"ball-stick", bonds:true, supercell:2
  },
  {
    id:"calcite", name:"Calcita", formula:"CaCO₃", family:"Carbonato",
    dataUrl:`${OC_CDN}/carbonates/CaCO3-Calcite.cif`,
    sourceUrl:`${OC_GH}/carbonates/CaCO3-Calcite.cif`,
    concept:"Grupos carbonato CO₃²⁻ planos alternam sua orientação na rede. O Ca²⁺ apresenta coordenação aproximadamente octaédrica por oxigênios.",
    keywords:"carbonato calcio romboedrico calcario grupo planar",
    representation:"ball-stick", bonds:true, supercell:2
  },
  {
    id:"corundum", name:"Coríndon", formula:"Al₂O₃", family:"Óxido",
    dataUrl:`${OC_CDN}/oxides/Al2O3-Corundum.cif`,
    sourceUrl:`${OC_GH}/oxides/Al2O3-Corundum.cif`,
    concept:"Oxigênios formam um empacotamento aproximadamente hexagonal compacto; Al³⁺ ocupa dois terços dos sítios octaédricos.",
    keywords:"oxido aluminio safira rubi octaedro trigonal",
    representation:"ball-stick", bonds:true, supercell:1
  },
  {
    id:"hematite", name:"Hematita", formula:"Fe₂O₃", family:"Óxido",
    dataUrl:`${OC_CDN}/oxides/Fe2O3-Hematite.cif`,
    sourceUrl:`${OC_GH}/oxides/Fe2O3-Hematite.cif`,
    concept:"Óxido de Fe³⁺ com estrutura do tipo coríndon. Os centros de ferro ocupam ambientes octaédricos distorcidos.",
    keywords:"oxido ferro corindon octaedro minério",
    representation:"ball-stick", bonds:true, supercell:1
  },
  {
    id:"magnetite", name:"Magnetita", formula:"Fe₃O₄", family:"Óxido · espinélio",
    dataUrl:`${OC_CDN}/oxides/Fe3O4-Magnetite.cif`,
    sourceUrl:`${OC_GH}/oxides/Fe3O4-Magnetite.cif`,
    concept:"Espinélio inverso com ferro em sítios tetraédricos e octaédricos. A distribuição de Fe²⁺/Fe³⁺ ajuda a explicar suas propriedades magnéticas.",
    keywords:"oxido ferro espinel inverso magnetismo tetraedro octaedro",
    representation:"ball-stick", bonds:true, supercell:1
  },
  {
    id:"forsterite", name:"Forsterita", formula:"Mg₂SiO₄", family:"Nesossilicato · olivina",
    dataUrl:`https://cdn.jsdelivr.net/gh/JohnKendrick/PDielec@${FORSTERITE_COMMIT}/Examples/Experiment/Forsterite/9000534.cif`,
    sourceUrl:`https://github.com/JohnKendrick/PDielec/blob/${FORSTERITE_COMMIT}/Examples/Experiment/Forsterite/9000534.cif`,
    concept:"Tetraedros SiO₄ isolados são conectados por poliedros de Mg. É o termo rico em magnésio da série das olivinas.",
    keywords:"olivina silicato magnesio nesossilicato manto tetraedro",
    representation:"ball-stick", bonds:true, supercell:1
  },
  {
    id:"kaolinite", name:"Caulinita", formula:"Al₂Si₂O₅(OH)₄", family:"Filossilicato · argila",
    dataUrl:`${OC_CDN}/clays/Al2Si2O9H4-Kaolinite.cif`,
    sourceUrl:`${OC_GH}/clays/Al2Si2O9H4-Kaolinite.cif`,
    concept:"Filossilicato 1:1: uma folha tetraédrica ligada a uma folha octaédrica. As camadas interagem por ligações de hidrogênio.",
    keywords:"argila filossilicato camadas tetraedrica octaedrica hidroxila",
    representation:"ball-stick", bonds:true, supercell:1
  },
  {
    id:"gypsum", name:"Gipsita", formula:"CaSO₄·2H₂O", family:"Sulfato hidratado",
    dataUrl:`${OC_CDN}/sulfates/CaSO4-2(H2O)-Gypsum.cif`,
    sourceUrl:`${OC_GH}/sulfates/CaSO4-2(H2O)-Gypsum.cif`,
    concept:"Tetraedros sulfato, cátions Ca²⁺ e moléculas de água organizam uma estrutura hidratada em camadas.",
    keywords:"sulfato calcio hidratado agua cristalização monoclinico",
    representation:"ball-stick", bonds:true, supercell:1
  }
];
