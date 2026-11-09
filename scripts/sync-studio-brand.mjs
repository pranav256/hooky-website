import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import studioPaths from "./studio-path.cjs";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const destination = studioPaths.resolveStudioDir(process.argv[2]);
mkdirSync(resolve(destination, "fonts"), { recursive: true });
const css = readFileSync(resolve(root, "public/brand.css"), "utf8").replaceAll(
  "/fonts/",
  "/static/fonts/",
);
writeFileSync(resolve(destination, "brand.css"), css);
for (const file of readdirSync(resolve(root, "public/fonts")))
  copyFileSync(
    resolve(root, "public/fonts", file),
    resolve(destination, "fonts", file),
  );
copyFileSync(resolve(root, "public/favicon.svg"), resolve(destination, "favicon.svg"));
console.log(`Hooky brand synced to ${destination}`);
