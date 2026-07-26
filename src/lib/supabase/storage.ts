export const PORTFOLIO_BUCKET = "portfolio-assets"

/**
 * Turns a public storage URL back into the object path we can pass to
 * `storage.remove()`. Public URLs look like:
 * {SUPABASE_URL}/storage/v1/object/public/{bucket}/{path}
 */
export function getStoragePath(
  publicUrl: string | null | undefined,
  bucket: string = PORTFOLIO_BUCKET
): string | null {
  if (!publicUrl) return null

  const marker = `/object/public/${bucket}/`
  const markerIndex = publicUrl.indexOf(marker)
  if (markerIndex === -1) return null

  const path = publicUrl.slice(markerIndex + marker.length).split(/[?#]/)[0]
  if (!path) return null

  try {
    return decodeURIComponent(path)
  } catch {
    return path
  }
}

/** Collects the removable object paths for a set of public URLs. */
export function collectStoragePaths(
  publicUrls: Array<string | null | undefined>,
  bucket: string = PORTFOLIO_BUCKET
): string[] {
  const paths = publicUrls
    .map((url) => getStoragePath(url, bucket))
    .filter((path): path is string => Boolean(path))

  return Array.from(new Set(paths))
}
