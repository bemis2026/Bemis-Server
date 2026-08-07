// Tarayıcıdan DOĞRUDAN Cloudinary'e yükleme için gereken genel yapılandırma.
//
// NEDEN VAR (2026-08-07): ürün görselleri `/api/admin/upload` vekilinden
// geçiyordu ve Vercel sunucu fonksiyonlarında istek gövdesi ~4.5 MB ile
// sınırlı → yüksek çözünürlüklü ürün render'ları (DC soket tutucu, Pro
// Mobile 2 …) yüklenemiyordu. Dosyayı Vercel'e hiç uğratmadan doğrudan
// Cloudinary'e göndermek hem bu tavanı kaldırır hem de ORİJİNAL baytları
// korur (yeniden kodlama/küçültme yok → kalite kuralı bozulmaz, şeffaf
// PNG şeffaf kalır).
//
// ⚠️ `upload_preset` GİZLİ BİLGİ DEĞİLDİR — imzasız (unsigned) preset'ler
// tam da istemci tarafında kullanılmak üzere tasarlanmıştır ve Cloudinary
// kendi dokümanlarında istemci koduna gömer. Yine de yalnız oturum açmış
// admin'e veriyoruz (gereksiz yere dışarı açmamak için).

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!verifyAdminSession(req.cookies.get("admin_auth")?.value)) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim() ?? "";
  const preset = process.env.CLOUDINARY_UPLOAD_PRESET?.trim() ?? "";

  return NextResponse.json({
    cloudName,
    preset,
    // İstemci bu bayrağa bakar: false ise doğrudan yükleme denenmez,
    // eski vekil yola düşülür (davranış aynen korunur).
    direct: Boolean(cloudName && preset),
  });
}
