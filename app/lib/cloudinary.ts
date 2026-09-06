// Cloudinary görsel kaynağını Vercel'in görsel optimize edicisine (/_next/image)
// KÜÇÜK teslim edilecek biçime çevirir.
//
// ⚠️ NEDEN (2026-09-06 ölçümü): Cloudinary son 30 gün 11 GB bant genişliği =
//    aylık kredinin ~%46'sı. 8.300 görsel isteğine 11 GB düşmesi, Vercel'in her
//    önbellek kaçırmasında 1–4,6 MB'lık HAM PNG orijinali baştan çekmesi demekti.
//    Ziyaretçi zaten Next'in AVIF/WebP çıktısını görüyor (q 88/90/95); kaynağın
//    Cloudinary'den `f_webp,q_auto:best` olarak gelmesi ziyaretçinin gördüğü
//    kaliteyi değiştirmez, Cloudinary'den inen baytı ~10 kat azaltır.
//    `c_limit,w_3840`: Next'in en büyük deviceSize'ı 3840 → daha büyük orijinal
//    hiçbir zaman gerekmez; küçük orijinaller BÜYÜTÜLMEZ (c_limit).
// ⚠️ KURAL (kullanıcı): orijinal dosyalar Cloudinary'de olduğu gibi kalır; admin
//    yüklemeleri değişmez. Bu yalnız TESLİM biçimi.
// ⚠️ Zaten dönüşüm içeren adresler (upload/ sonrası v123/ ile başlamayan) ve
//    SVG/GIF (vektör/animasyon) DOKUNULMAZ.
const CLOUDINARY_RE = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(v\d+\/.+)$/;
const TESLIM = "t_teslim/"; // Cloudinary adlı dönüşümü: f_webp,q_auto:best,c_limit,w_3840
// ⚠️ Hesapta STRICT TRANSFORMATIONS AÇIK → anlık dönüşüm (w_100 gibi) 401 döner; yalnız
//    "allowed_for_strict" işaretli ADLI dönüşümler geçer. `teslim` 2026-09-06'da Admin API ile
//    oluşturuldu ve izinlendi. SİLİNİRSE tüm ürün görselleri 401 olur — önce bunu kontrol et.

export function cloudinarySrc(src: string): string {
  const m = CLOUDINARY_RE.exec(src);
  if (!m) return src;
  if (/\.(svg|gif)(\?.*)?$/i.test(m[2])) return src;
  return m[1] + TESLIM + m[2];
}
