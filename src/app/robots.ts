import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/cart", "/checkout"],
      },
    ],
    sitemap: "https://bhuvikastudio.com/sitemap.xml",
  };
}
