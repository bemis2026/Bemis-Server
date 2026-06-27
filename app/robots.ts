import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // AI/LLM tarayıcıları AÇIKÇA izinli (GEO/AEO): ChatGPT, Claude, Perplexity,
  // Google AI Overviews (Google-Extended), Common Crawl (CCBot), Apple.
  // "*" zaten izin veriyordu; açık kural net sinyaldir + ileride biri "*" kısıtlarsa
  // AI erişimi korunur. /admin + /api/ hepsine kapalı (taranmasına gerek yok).
  const aiBots = [
    "GPTBot",            // OpenAI eğitim/tarama
    "OAI-SearchBot",     // ChatGPT arama
    "ChatGPT-User",      // ChatGPT canlı getirme
    "ClaudeBot",         // Anthropic Claude
    "anthropic-ai",      // Anthropic (eski)
    "PerplexityBot",     // Perplexity dizin
    "Perplexity-User",   // Perplexity canlı getirme
    "Google-Extended",   // Google Gemini / AI Overviews
    "Applebot-Extended", // Apple Intelligence
    "CCBot",             // Common Crawl (birçok LLM verisi)
    "cohere-ai",         // Cohere
  ];
  const disallow = ["/admin", "/api/"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: aiBots, allow: "/", disallow },
    ],
    sitemap: "https://www.bemisevcharge.com.tr/sitemap.xml",
  };
}
