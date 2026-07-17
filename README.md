# MineralAR

**MineralAR** é uma aplicação educacional aberta para explorar estruturas minerais em **3D** e **realidade aumentada no navegador**.

## Versão

`v0.1.0` — primeira galeria mineralógica experimental.

## Aplicação

- Site: https://arigony.github.io/MineralAR/
- Código: https://github.com/arigony/MineralAR

## Coleção inicial

| Mineral | Fórmula | Classe | Conceito estrutural |
|---|---|---|---|
| Halita | NaCl | Haleto | Estrutura sal-gema, coordenação 6:6 |
| Fluorita | CaF₂ | Haleto | Coordenação Ca:F = 8:4 |
| Quartzo α | SiO₂ | Tectossilicato | Rede de tetraedros SiO₄ |
| Calcita | CaCO₃ | Carbonato | Grupos carbonato planos |
| Coríndon | Al₂O₃ | Óxido | Al em sítios octaédricos |
| Hematita | Fe₂O₃ | Óxido | Estrutura tipo coríndon |
| Magnetita | Fe₃O₄ | Óxido / espinélio | Espinélio inverso |
| Forsterita | Mg₂SiO₄ | Nesossilicato | Tetraedros isolados, grupo da olivina |
| Caulinita | Al₂Si₂O₅(OH)₄ | Filossilicato | Camadas 1:1 |
| Gipsita | CaSO₄·2H₂O | Sulfato hidratado | Água de cristalização e estrutura em camadas |

## Funcionalidades

- galeria pesquisável por nome, fórmula, classe e conceito;
- leitura de CIF experimental;
- cela unitária e supercelas;
- modos ball-and-stick, space-filling e wireframe;
- conexões inferidas geometricamente;
- metadados COD e AMCSD preservados quando presentes;
- referência bibliográfica extraída do CIF;
- upload local de arquivos `.cif`;
- download do CIF selecionado;
- modo WebAR com câmera frontal ou traseira;
- rastreamento de mão com MediaPipe;
- rotação por gesto e zoom por pinça;
- fallback por toque, mouse e roda.

## Proveniência dos dados

A maior parte dos CIFs da galeria é carregada de uma revisão fixada do repositório
[OpenChemistry/crystals](https://github.com/OpenChemistry/crystals), que declara os
arquivos como domínio público e informa que as estruturas não-zeolíticas provêm do
Crystallography Open Database (COD). Os próprios CIFs preservam referências,
identificadores COD e, em várias entradas, identificadores AMCSD.

A forsterita utiliza o CIF COD `9000534`, fixado em uma revisão do repositório
[PDielec](https://github.com/JohnKendrick/PDielec).

Os URLs usam commits fixos, evitando alterações silenciosas das estruturas.

> A galeria é destinada ao ensino. Para pesquisa, consulte a publicação cristalográfica original e avalie temperatura, pressão, composição, ocupação e qualidade do refinamento.

## Execução local

```bash
python -m http.server 8000
```

Depois abra `http://localhost:8000`.

## Verificações

```bash
npm run check
npm test
npm run smoke:remote
```

O teste remoto confirma que os dez CIFs respondem, contêm bloco `data_`, parâmetros
de cela e coordenadas fracionárias.

## Limitações atuais

- o parser cobre CIF 1.1 comum, não todos os casos avançados;
- conexões são inferidas por distância e não equivalem automaticamente a ligações químicas;
- poliedros de coordenação explícitos estão planejados para uma versão posterior;
- os CIFs são carregados de URLs externos fixados e armazenados no cache do navegador após o primeiro acesso;
- o rastreamento de mão depende dos arquivos do MediaPipe fornecidos por CDN.

## Licença

Código: MIT.

Dados estruturais: mantenha as referências e condições estabelecidas dentro de cada CIF.
A coleção OpenChemistry declara seus arquivos como domínio público; os dados COD são
disponibilizados sob CC0, com atribuição acadêmica recomendada às publicações originais.

## Autor

**Prof. Dr. André Arigony Souto**  
Pontifícia Universidade Católica do Rio Grande do Sul — PUCRS  
ORCID: https://orcid.org/0000-0002-2437-8767

## Projeto relacionado

MolecuAR: https://doi.org/10.26434/chemrxiv.15006086/v1
