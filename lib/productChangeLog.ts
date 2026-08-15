import "server-only";

/**
 * ÜRÜN DEĞİŞİKLİK GÜNLÜĞÜ — bayi beslemesinin çekirdeği.
 *
 * ⚠️ NEDEN YAZMA ANINDA: admin kaydettiğinde ürün kutusunun ÜSTÜNE yazılıyor,
 *    eski hâl kayboluyor. Yani "bu ürünün fiyatı ne zaman değişti" sorusu
 *    sonradan HİÇBİR ŞEKİLDE cevaplanamaz. Değişiklik ancak yazma anında
 *    yakalanabilir — bu dosyanın tek varlık sebebi bu.
 *
 * ⚠️ FİYAT METİN OLARAK SAKLANIYOR ("EUR 370,00" / "€ 286,00" /
 *    "7.161,00 € (KDV hariç)"). Makine tarafı için ayrıca sayısal değer de
 *    üretilir; ayrıştırılamazsa `null` bırakılır — UYDURULMAZ.
 */

export type UrunDegisiklik = {
  at: string;                 // ISO zaman damgası
  tip: "eklendi" | "cikarildi" | "guncellendi";
  kat: string;
  id: string;
  code: string;
  ad: string;
  alan?: string;              // guncellendi ise hangi alan
  eski?: string | null;
  yeni?: string | null;
  eskiSayi?: number | null;   // yalnız fiyat alanında
  yeniSayi?: number | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Herhangi = any;

const FIYAT_RE = /fiyat|price/i;

export function fiyatMetni(p: Herhangi): string {
  for (const g of (p?.specs ?? [])) for (const i of (g?.items ?? [])) {
    if (FIYAT_RE.test(String(i?.label ?? ""))) return String(i?.value ?? "");
  }
  return "";
}

/**
 * "EUR 370,00" · "€ 286,00" · "7.161,00 € (KDV hariç)" · "€27,500.00" → sayı
 * ⚠️ Biçim KAYNAĞIN DİLİNDEN gelir; metne bakıp tahmin etmek hatalıdır
 *    (bu tuzağa daha önce düşüldü: İngilizce fiyat `€27.500,000.00` olmuştu).
 *    Burada yalnız TR kaynağı işlendiği için TR biçimi (binlik `.`, ondalık `,`)
 *    varsayılır; çözülemezse null döner.
 */
export function fiyatSayisi(s: string): number | null {
  const t = String(s).replace(/[^\d.,]/g, "");
  if (!t) return null;
  const v = parseFloat(t.replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", "."));
  return Number.isFinite(v) ? v : null;
}

function duzle(kats: Herhangi[]): Map<string, Herhangi> {
  const m = new Map<string, Herhangi>();
  for (const k of (kats ?? [])) for (const p of (k?.products ?? [])) {
    if (p?.id) m.set(String(p.id), { ...p, __kat: k.id });
  }
  return m;
}

const specHaritasi = (p: Herhangi): Map<string, string> => {
  const m = new Map<string, string>();
  for (const g of (p?.specs ?? [])) for (const i of (g?.items ?? [])) {
    const et = String(i?.label ?? "");
    if (!et || FIYAT_RE.test(et)) continue;   // fiyat ayrı ele alınır
    m.set(et, String(i?.value ?? ""));
  }
  return m;
};

const dizi = (v: unknown) => (Array.isArray(v) ? [...v].map(String).sort().join(", ") : "");

/**
 * İki katalog sürümünü karşılaştırır. Dönen kayıtlar bayi beslemesine gider.
 * ⚠️ Yalnız TR kaynağı karşılaştırılır — çeviriler türev, olgu değil.
 */
export function urunFarki(onceki: Herhangi[], sonraki: Herhangi[], at = new Date().toISOString()): UrunDegisiklik[] {
  const E = duzle(onceki), Y = duzle(sonraki);
  const out: UrunDegisiklik[] = [];
  const temel = (p: Herhangi) => ({ at, kat: String(p.__kat ?? ""), id: String(p.id ?? ""), code: String(p.code ?? ""), ad: String(p.name ?? "") });

  for (const [id, p] of Y) if (!E.has(id)) {
    const f = fiyatMetni(p);
    out.push({ ...temel(p), tip: "eklendi", alan: "fiyat", yeni: f || null, yeniSayi: fiyatSayisi(f) });
  }
  for (const [id, p] of E) if (!Y.has(id)) out.push({ ...temel(p), tip: "cikarildi" });

  for (const [id, y] of Y) {
    const e = E.get(id);
    if (!e) continue;
    const ekle = (alan: string, a: string, b: string, sayisal = false) => {
      if (a === b) return;
      out.push({
        ...temel(y), tip: "guncellendi", alan, eski: a || null, yeni: b || null,
        ...(sayisal ? { eskiSayi: fiyatSayisi(a), yeniSayi: fiyatSayisi(b) } : {}),
      });
    };
    ekle("fiyat", fiyatMetni(e), fiyatMetni(y), true);
    ekle("ad", String(e.name ?? ""), String(y.name ?? ""));
    ekle("kod", String(e.code ?? ""), String(y.code ?? ""));
    ekle("altBaslik", String(e.subtitle ?? ""), String(y.subtitle ?? ""));
    ekle("aciklama", String(e.description ?? ""), String(y.description ?? ""));
    ekle("gorsel", String(e.image ?? ""), String(y.image ?? ""));
    ekle("sertifika", dizi(e.certificates), dizi(y.certificates));
    ekle("ozellik", dizi(e.features), dizi(y.features));
    // spec satırları — etiket bazında
    const se = specHaritasi(e), sy = specHaritasi(y);
    for (const [et, deger] of sy) { const o = se.get(et); if (o !== undefined && o !== deger) ekle(`spec:${et}`, o, deger); }
  }
  return out;
}

/** Bin'de tutulacak en fazla kayıt — sınırsız büyümesin. */
export const MAX_KAYIT = 4000;
