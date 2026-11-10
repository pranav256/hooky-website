import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import studioPaths from "./studio-path.cjs";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const destination = studioPaths.resolveStudioDir(process.argv[2]);
mkdirSync(destination, { recursive: true });
const css = readFileSync(resolve(root, "public/brand.css"), "utf8");
writeFileSync(resolve(destination, "brand.css"), css);
copyFileSync(
  resolve(root, "public/favicon.svg"),
  resolve(destination, "favicon.svg"),
);
console.log(`Hooky brand synced to ${destination}`);
