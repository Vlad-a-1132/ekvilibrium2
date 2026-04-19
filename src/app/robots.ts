import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/api/",
          "/cart",
          "/checkout",
          "/login",
          "/register",
          "/account",
          "/wishlist",
          "/search",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
