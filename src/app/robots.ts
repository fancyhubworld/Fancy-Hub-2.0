import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fancyhub.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/shop",
          "/product/",
          "/p/",
          "/category/",
          "/store/",
          "/vendor/",
          "/brand/",
          "/tag/",
          "/deals",
          "/flash-sale",
          "/new-arrivals",
          "/best-sellers",
          "/custom-print",
          "/help",
        ],
        disallow: [
          "/admin/",
          "/admin/*",
          "/vendor/dashboard/",
          "/vendor/products/",
          "/vendor/orders/",
          "/vendor/staff/",
          "/vendor/wallet/",
          "/vendor/withdraw/",
          "/account/",
          "/account/*",
          "/checkout",
          "/checkout/*",
          "/cart",
          "/api/",
          "/api/*",
          "/order-success",
          "/orders/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
