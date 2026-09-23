import fs from "node:fs";
import path from "node:path";
import { gallery, type GalleryPhoto } from "@/content/site";

/** Gallery entries whose file is actually in /public/gallery. Server-only. */
export function getGalleryPhotos(): (GalleryPhoto & { src: string })[] {
  const dir = path.join(process.cwd(), "public", "gallery");
  return gallery
    .filter((p) => fs.existsSync(path.join(dir, p.file)))
    .map((p) => ({ ...p, src: `/gallery/${p.file}` }));
}
