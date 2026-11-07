import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { resolve } from "node:path";
const destination = resolve(process.argv[2] || "../Hooky/hooky/web/static");
if (!existsSync(resolve(destination, "index.html")))
  throw new Error(
    `Studio index.html not found at ${destination}. Pass its static directory as the first argument.`,
  );
mkdirSync(resolve(destination, "fonts"), { recursive: true });
const css = readFileSync("public/brand.css", "utf8").replaceAll(
  "/fonts/",
  "/static/fonts/",
);
writeFileSync(resolve(destination, "brand.css"), css);
for (const file of readdirSync("public/fonts"))
  copyFileSync(
    resolve("public/fonts", file),
    resolve(destination, "fonts", file),
  );
copyFileSync("public/favicon.svg", resolve(destination, "favicon.svg"));
console.log(`Hooky brand synced to ${destination}`);
