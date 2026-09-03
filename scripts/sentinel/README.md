# Bekçi betikleri — SÜRÜMLÜ YEDEK (canlı konum DEĞİL)

Canlı konum (cron görevlerinin çalıştırdığı): `C:\Users\sales\.claude\bemis-sentinels\`
(`gunluk-site-saglik` → site-sentinel.cjs, `haftalik-seo-site-kontrol` → seo-sentinel.cjs; baseline + rapor dosyaları orada).

Eski konum `Desktop\Bemis_Raporlar` en az 3 kez silindi (2026-08-08/16/17, Geri Dönüşüm Kutusu'nda izleri var);
2026-08-15'te görevler `.claude\bemis-sentinels\`'a taşındı. Bu klasör yalnız betiklerin git yedeğidir —
canlı klasör kaybolursa buradan geri kopyalanır, baseline `node site-sentinel.cjs --rebaseline` ile yeniden alınır.

Kural (site-sentinel): sayımlar yalnız yukarı gider; her DÜŞÜŞ alarmdır ve alarm varken baseline DONAR.
Meşru düşüşte (ör. bir döküman bilerek gizlendi) `--rebaseline` çalıştır — aksi hâlde günlük görev her gün alarm verir
(2026-08-25 → 09-03 arası tam bu oldu: döküman 14→13).
