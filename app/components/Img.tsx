import NextImage, { type ImageProps } from "next/image";
import { cloudinarySrc } from "../lib/cloudinary";

// `next/image` sarmalayıcısı: Cloudinary kaynaklarını küçük teslim biçimine
// çevirir (bkz. lib/cloudinary.ts), geri kalan her şey birebir next/image.
// Global `images.loaderFile` KULLANILMADI: Next 16'da özel loader `/_next/image`
// rotasını kapatıyor (next-server.js: loader !== 'default' → optimizer yok) ve
// yerel görseller (logo, fabrika fotoğrafları) optimize edilmeden kalırdı.
export default function Image(props: ImageProps) {
  const { src } = props;
  if (typeof src === "string") {
    const kaynak = cloudinarySrc(src);
    if (kaynak !== src) return <NextImage {...props} src={kaynak} />;
  }
  return <NextImage {...props} />;
}
