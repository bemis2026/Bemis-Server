// Özgün inline-SVG teknik diyagramlar — TEK KAYNAK.
// Hem blog (posts.ts figure) hem sözlük (glossary.ts diagram + GlossaryClient) buradan kullanır.
// Server-render edilir → ham SSR HTML'de görünür <text> etiketleriyle (AI/Google multimodal).
// currentColor + #3B82F6 (tasarım dili). Rakip marka YOK; uydurma spec YOK.
//
// 🌍 ÇOK DİLLİ (2026-09-10): SVG içindeki metinler artık ŞABLON + etiket sözlüğü
//    (`diagramLabels.ts`) ile üretilir. `diyagram(id, lang)` istenen dilde döner.
//    ⚠️ Bu dosya SUNUCU tarafındadır (posts.ts/glossary.ts üzerinden); istemci dil
//    değiştirdiğinde çevrili SVG'yi `data/i18n/{blog,glossary}.json` içinden alır —
//    oraya `npm run gen:diagram-i18n` yazar. Etiketi değiştirdiysen betiği TEKRAR ÇALIŞTIR.

import { TYPE2, MOD, DLM, ACDC, type Type2Etiket, type ModEtiket, type DlmEtiket, type AcDcEtiket } from "./diagramLabels";

export type DiagramId = "type2-ccs2" | "mod-2-3" | "dlm" | "ac-dc";
export type Diagram = { id: DiagramId; alt: string; caption: string; svg: string };

// XML kaçışı — etiketlerde & < > geçerse SVG bozulmasın (TR etiketlerinde yok, çıktı birebir aynı).
const e = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function type2Svg(L: Type2Etiket): string {
  return `<svg viewBox='0 0 640 272' xmlns='http://www.w3.org/2000/svg' style='width:100%;max-width:640px;height:auto' font-family='inherit'><title>${e(L.t)}</title><desc>${e(L.d)}</desc><text x='20' y='24' font-size='13' font-weight='700' fill='#3B82F6'>${e(L.ust)}</text><rect x='20' y='34' width='600' height='80' rx='14' fill='none' stroke='currentColor' stroke-width='1.5'/><g text-anchor='middle' font-size='13'><g fill='none' stroke='currentColor' stroke-width='1.5'><circle cx='90' cy='64' r='20'/><circle cx='170' cy='64' r='20'/><circle cx='250' cy='64' r='20'/><circle cx='330' cy='64' r='20'/><circle cx='410' cy='64' r='20'/></g><g fill='none' stroke='#3B82F6' stroke-width='1.5'><circle cx='488' cy='64' r='16'/><circle cx='560' cy='64' r='16'/></g><g fill='currentColor'><text x='90' y='69'>L1</text><text x='170' y='69'>L2</text><text x='250' y='69'>L3</text><text x='330' y='69'>N</text><text x='410' y='69'>PE</text></g><g fill='#3B82F6' font-size='11'><text x='488' y='68'>CP</text><text x='560' y='68'>PP</text></g></g><text x='30' y='104' font-size='11' fill='currentColor'>${e(L.ustNot)}</text><text x='20' y='150' font-size='13' font-weight='700' fill='#3B82F6'>${e(L.alt2)}</text><rect x='20' y='160' width='600' height='80' rx='14' fill='none' stroke='#3B82F6' stroke-width='2'/><g><text x='40' y='194' font-size='12' fill='currentColor'>${e(L.s1)}</text><text x='40' y='214' font-size='12' fill='currentColor'>${e(L.s2)}</text><g fill='none' stroke='#3B82F6' stroke-width='2'><circle cx='470' cy='200' r='24'/><circle cx='560' cy='200' r='24'/></g><g fill='#3B82F6' font-weight='700' font-size='14' text-anchor='middle'><text x='470' y='205'>DC+</text><text x='560' y='205'>DC−</text></g></g><text x='20' y='262' font-size='11' fill='#3B82F6' font-weight='700'>${e(L.dip)}</text></svg>`;
}

function modSvg(L: ModEtiket): string {
  return `<svg viewBox='0 0 640 226' xmlns='http://www.w3.org/2000/svg' style='width:100%;max-width:640px;height:auto' font-family='inherit'><title>${e(L.t)}</title><desc>${e(L.d)}</desc><defs><marker id='modAr' markerWidth='9' markerHeight='9' refX='7' refY='3.5' orient='auto'><path d='M0,0 L7,3.5 L0,7 Z' fill='#3B82F6'/></marker></defs><text x='16' y='22' font-size='13' font-weight='700' fill='#3B82F6'>${e(L.m2)}</text><g fill='none' stroke='currentColor' stroke-width='1.5'><rect x='16' y='38' width='92' height='44' rx='9'/><rect x='176' y='38' width='118' height='44' rx='9' stroke='#3B82F6' stroke-width='2'/><rect x='362' y='38' width='92' height='44' rx='9'/></g><g text-anchor='middle' font-size='11' fill='currentColor'><text x='62' y='64'>${e(L.priz)}</text><text x='235' y='58' fill='#3B82F6' font-weight='700'>${e(L.icpd)}</text><text x='235' y='72' fill='#3B82F6' font-size='9'>${e(L.icpdAlt)}</text><text x='408' y='64'>${e(L.arac)}</text></g><g stroke='#3B82F6' stroke-width='1.5' marker-end='url(#modAr)'><line x1='108' y1='60' x2='172' y2='60'/><line x1='294' y1='60' x2='358' y2='60'/></g><text x='16' y='104' font-size='11' fill='currentColor'>${e(L.m2not)}</text><text x='16' y='148' font-size='13' font-weight='700' fill='#3B82F6'>${e(L.m3)}</text><g fill='none' stroke='currentColor' stroke-width='1.5'><rect x='16' y='164' width='136' height='44' rx='9' stroke='#3B82F6' stroke-width='2'/><rect x='256' y='164' width='92' height='44' rx='9'/></g><g text-anchor='middle' font-size='11'><text x='84' y='183' fill='#3B82F6' font-weight='700'>${e(L.wb)}</text><text x='84' y='198' fill='#3B82F6' font-size='9'>${e(L.wbAlt)}</text><text x='302' y='190' fill='currentColor'>${e(L.arac)}</text></g><line x1='152' y1='186' x2='252' y2='186' stroke='#3B82F6' stroke-width='1.5' marker-end='url(#modAr)'/><text x='370' y='184' font-size='11' fill='currentColor'>${e(L.m3not1)}</text><text x='370' y='201' font-size='11' fill='currentColor'>${e(L.m3not2)}</text></svg>`;
}

function dlmSvg(L: DlmEtiket): string {
  return `<svg viewBox='0 0 640 244' xmlns='http://www.w3.org/2000/svg' style='width:100%;max-width:640px;height:auto' font-family='inherit'><title>${e(L.t)}</title><desc>${e(L.d)}</desc><defs><marker id='dlmAr' markerWidth='9' markerHeight='9' refX='7' refY='3.5' orient='auto'><path d='M0,0 L7,3.5 L0,7 Z' fill='#3B82F6'/></marker></defs><g fill='none' stroke='currentColor' stroke-width='1.5'><rect x='16' y='92' width='118' height='58' rx='10'/></g><rect x='244' y='92' width='118' height='58' rx='10' fill='none' stroke='#3B82F6' stroke-width='2'/><g text-anchor='middle' font-size='12'><text x='75' y='116' fill='currentColor'>${e(L.pano)}</text><text x='75' y='134' fill='currentColor' font-weight='700'>${e(L.limit)}</text><text x='303' y='116' fill='#3B82F6' font-weight='700'>${e(L.dlm)}</text><text x='303' y='134' fill='#3B82F6' font-size='10'>${e(L.kont)}</text></g><line x1='134' y1='121' x2='240' y2='121' stroke='#3B82F6' stroke-width='1.5' marker-end='url(#dlmAr)'/><g fill='none' stroke='currentColor' stroke-width='1.5'><rect x='498' y='16' width='126' height='42' rx='9'/><rect x='498' y='100' width='126' height='42' rx='9'/><rect x='498' y='184' width='126' height='42' rx='9'/></g><g text-anchor='middle' font-size='11' fill='currentColor'><text x='561' y='42'>${e(L.wb)} 1</text><text x='561' y='126'>${e(L.wb)} 2</text><text x='561' y='210'>${e(L.wb)} 3</text></g><g stroke='#3B82F6' stroke-width='1.5' marker-end='url(#dlmAr)'><line x1='362' y1='112' x2='494' y2='40'/><line x1='362' y1='121' x2='494' y2='121'/><line x1='362' y1='130' x2='494' y2='202'/></g><text x='16' y='182' font-size='11' fill='currentColor'>${e(L.n1)}</text><text x='16' y='200' font-size='11' fill='currentColor'>${e(L.n2)}</text><text x='16' y='218' font-size='11' fill='currentColor'>${e(L.n3)}</text></svg>`;
}

function acdcSvg(L: AcDcEtiket): string {
  return `<svg viewBox='0 0 660 212' xmlns='http://www.w3.org/2000/svg' style='width:100%;max-width:660px;height:auto' font-family='inherit'><title>${e(L.t)}</title><defs><marker id='acdcAr' markerWidth='9' markerHeight='9' refX='7' refY='3.5' orient='auto'><path d='M0,0 L7,3.5 L0,7 Z' fill='#3B82F6'/></marker></defs><text x='6' y='24' font-size='13' font-weight='700' fill='#3B82F6'>${e(L.ac)}</text><g fill='none' stroke='currentColor' stroke-width='1.5'><rect x='6' y='38' width='120' height='44' rx='9'/><rect x='190' y='38' width='120' height='44' rx='9'/><rect x='374' y='38' width='150' height='44' rx='9' stroke='#3B82F6' stroke-width='2'/><rect x='572' y='38' width='82' height='44' rx='9'/></g><g font-size='11' fill='currentColor' text-anchor='middle'><text x='66' y='64'>${e(L.seb)}</text><text x='250' y='64'>${e(L.ist)}</text><text x='449' y='59' fill='#3B82F6' font-weight='700'>${e(L.arac)}</text><text x='449' y='73' fill='#3B82F6' font-size='9'>${e(L.ob)}</text><text x='613' y='64'>${e(L.bat)}</text></g><g stroke='#3B82F6' stroke-width='1.5' marker-end='url(#acdcAr)'><line x1='126' y1='60' x2='186' y2='60'/><line x1='310' y1='60' x2='370' y2='60'/><line x1='524' y1='60' x2='568' y2='60'/></g><g font-size='9' fill='#3B82F6' text-anchor='middle'><text x='156' y='53'>AC</text><text x='340' y='53'>AC</text><text x='546' y='53'>DC</text></g><text x='6' y='130' font-size='13' font-weight='700' fill='#3B82F6'>${e(L.dc)}</text><g fill='none' stroke='currentColor' stroke-width='1.5'><rect x='6' y='144' width='120' height='44' rx='9'/><rect x='280' y='144' width='170' height='44' rx='9' stroke='#3B82F6' stroke-width='2'/><rect x='572' y='144' width='82' height='44' rx='9'/></g><g font-size='11' fill='currentColor' text-anchor='middle'><text x='66' y='170'>${e(L.seb)}</text><text x='365' y='165' fill='#3B82F6' font-weight='700'>${e(L.ist)}</text><text x='365' y='179' fill='#3B82F6' font-size='9'>${e(L.cev)}</text><text x='613' y='170'>${e(L.bat)}</text></g><g stroke='#3B82F6' stroke-width='1.5' marker-end='url(#acdcAr)'><line x1='126' y1='166' x2='276' y2='166'/><line x1='450' y1='166' x2='568' y2='166'/></g><g font-size='9' fill='#3B82F6' text-anchor='middle'><text x='200' y='159'>AC</text><text x='508' y='159'>DC</text></g></svg>`;
}

/** Diyagramı istenen dilde üretir; dil yoksa TR'ye düşer (güvenli). */
export function diyagram(id: DiagramId, lang: string): Diagram {
  switch (id) {
    case "type2-ccs2": {
      const L = TYPE2[lang] ?? TYPE2.tr;
      return { id, alt: L.alt, caption: L.cap, svg: type2Svg(L) };
    }
    case "mod-2-3": {
      const L = MOD[lang] ?? MOD.tr;
      return { id, alt: L.alt, caption: L.cap, svg: modSvg(L) };
    }
    case "dlm": {
      const L = DLM[lang] ?? DLM.tr;
      return { id, alt: L.alt, caption: L.cap, svg: dlmSvg(L) };
    }
    case "ac-dc": {
      const L = ACDC[lang] ?? ACDC.tr;
      return { id, alt: L.alt, caption: L.cap, svg: acdcSvg(L) };
    }
  }
}

// TR sabitleri — posts.ts ve glossary.ts bunları kullanır (kaynak dil daima TR).
export const DIAGRAM_TYPE2_CCS2: Diagram = diyagram("type2-ccs2", "tr");
export const DIAGRAM_MOD23: Diagram = diyagram("mod-2-3", "tr");
export const DIAGRAM_DLM: Diagram = diyagram("dlm", "tr");
export const DIAGRAM_AC_DC: Diagram = diyagram("ac-dc", "tr");
