import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://scriptauradev.com";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/courses", "/courses/*", "/contact", "/verify"],
      disallow: [
        "/api/*",
        "/admin/*",
        "/dashboard/*",
        "/login",
        "/register",
        "/*.json$",
        "/*.xml$",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
