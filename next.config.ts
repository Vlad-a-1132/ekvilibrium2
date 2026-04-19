import type { NextConfig } from "next";

/**
 * Hashed chunks and CSS are already served under `/_next/static/...`.
 * If `assetPrefix` is set to `/_next` (a common mistake), the runtime builds URLs like
 * `/_next/_next/static/chunks/...`, which 404 and can surface as
 * "can't infer type of chunk from URL app-pages-internals".
 *
 * Valid values: omit / empty, a full CDN origin (`https://cdn.example.com`), or a non-`/_next` path prefix.
 */
function normalizeAssetPrefix(): string | undefined {
  const raw =
    process.env.ASSET_PREFIX?.trim() ?? process.env.NEXT_ASSET_PREFIX?.trim();
  if (!raw) return undefined;

  const noTrailingSlash = raw.replace(/\/+$/, "");
  const isInvalid =
    noTrailingSlash === "/_next" || noTrailingSlash.endsWith("/_next");
  if (isInvalid) {
    console.warn(
      `[next.config] Ignoring invalid ASSET_PREFIX/NEXT_ASSET_PREFIX="${raw}". ` +
        `Use a full CDN URL or a path that is not /_next (Next already uses /_next for build output).`,
    );
    return undefined;
  }

  return raw;
}

const nextConfig: NextConfig = {
  assetPrefix: normalizeAssetPrefix(),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
