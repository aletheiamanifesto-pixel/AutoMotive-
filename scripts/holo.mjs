// @ts-check
/**
 * `npm run holo -- --character test-blob --display pane45`
 * Avvia il runtime olografico (apps/holo) e apre il browser sul personaggio scelto.
 */
import { existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { createServer } from "vite";
import { HELP, parseHoloArgs } from "./holo-args.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const charactersDir = join(root, "characters");
const available = readdirSync(charactersDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(charactersDir, d.name, "manifest.json")))
  .map((d) => d.name);

let args;
try {
  args = parseHoloArgs(process.argv.slice(2), available);
} catch (error) {
  console.error(`\n✖ ${error instanceof Error ? error.message : error}\n`);
  process.exit(1);
}
if ("help" in args) {
  console.log(HELP);
  process.exit(0);
}

const path = `/?character=${encodeURIComponent(args.character)}&display=${encodeURIComponent(args.display)}`;
const server = await createServer({
  root: join(root, "apps", "holo"),
  configFile: join(root, "apps", "holo", "vite.config.ts"),
  server: { open: args.open ? path : false },
});
await server.listen();
const url = server.resolvedUrls?.local[0] ?? "http://localhost:5173/";
console.log(`\n  ◆ AutoMotive holo · personaggio: ${args.character} · display: ${args.display}`);
console.log(`  ➜ ${new URL(path, url).href}\n  (Ctrl+C per chiudere)\n`);
