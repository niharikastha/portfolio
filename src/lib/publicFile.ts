import fs from "node:fs";
import path from "node:path";

/** True if `/some/file.jpg` exists under /public. Server-only; read at build time. */
export function publicFileExists(src: string) {
  return fs.existsSync(path.join(process.cwd(), "public", src));
}
