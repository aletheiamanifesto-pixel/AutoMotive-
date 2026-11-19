// @ts-check
/**
 * `npm run holo -- --character test-blob --display pane45`
 * Avvia il runtime olografico (apps/holo) e apre il browser sul personaggio scelto.
 */
import { existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { networkInterfaces } from "node:os";
import { createServer } from "vite";
import qrcode from "qrcode-terminal";
import { HELP, parseHoloArgs } from "./holo-args.mjs";
import { lanCandidates, rankLanAddresses } from "./lan.mjs";

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
  // host: true → ascolta su tutte le interfacce di rete, così il telefono sullo stesso Wi-Fi lo raggiunge
  server: { open: args.open ? path : false, host: args.phone },
});
await server.listen();
const url = server.resolvedUrls?.local[0] ?? "http://localhost:5173/";
console.log(`\n  ◆ AutoMotive holo · personaggio: ${args.character} · display: ${args.display}`);
console.log(`  ➜ su questo PC:  ${new URL(path, url).href}`);

if (args.phone) {
  const port = new URL(url).port;
  const [best, ...others] = rankLanAddresses(lanCandidates(networkInterfaces()));
  if (!best) {
    console.log("\n  ⚠ Nessuna rete trovata: il PC è collegato al Wi-Fi?");
  } else {
    const phoneUrl = `http://${best.address}:${port}${path}`;
    console.log(`  ➜ dal telefono:  ${phoneUrl}   (${best.name})`);
    if (others.length > 0) {
      console.log(
        `    altri indirizzi, di solito schede virtuali: ${others.map((o) => `${o.address} (${o.name})`).join(", ")}`,
      );
    }
    console.log("\n  Inquadra il QR code con la fotocamera del telefono (stesso Wi-Fi del PC):\n");
    qrcode.generate(phoneUrl, { small: true });
    console.log("  Su Windows, se compare l'avviso del firewall, consenti l'accesso alle reti private.");
  }
}
console.log("\n  (Ctrl+C per chiudere)\n");
