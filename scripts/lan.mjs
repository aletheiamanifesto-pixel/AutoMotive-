// @ts-check
/**
 * Sceglie l'indirizzo di rete che il telefono può davvero raggiungere.
 * Su Windows ci sono spesso schede virtuali (Hyper-V/WSL, VirtualBox, VMware, Docker) con
 * indirizzi che il telefono non vede: vanno messe in fondo. Funzione pura, testata in tests/lan.test.ts.
 */

/** @typedef {{ name: string, address: string }} LanCandidate */

const VIRTUAL_NAME =
  /vEthernet|VirtualBox|VMware|Hyper-?V|WSL|Docker|vboxnet|virbr|veth|^br-|Loopback|Tailscale|ZeroTier|utun|bridge/i;
const WIRELESS_NAME = /Wi-?Fi|WLAN|wireless|^wl|^en0$/i;

/** @param {string} address */
function isPrivate172(address) {
  const second = Number(address.split(".")[1]);
  return address.startsWith("172.") && second >= 16 && second <= 31;
}

/** @param {LanCandidate} c */
export function lanScore({ name, address }) {
  let score = 0;
  if (VIRTUAL_NAME.test(name)) score -= 100;
  if (address.startsWith("192.168.56.")) score -= 50; // rete host-only predefinita di VirtualBox
  if (isPrivate172(address)) score -= 20; // tipica di Hyper-V, WSL e Docker
  if (WIRELESS_NAME.test(name)) score += 10;
  if (address.startsWith("192.168.")) score += 5;
  else if (address.startsWith("10.")) score += 3;
  return score;
}

/**
 * @param {LanCandidate[]} candidates
 * @returns {LanCandidate[]} dal più probabile al meno probabile
 */
export function rankLanAddresses(candidates) {
  return [...candidates].sort((a, b) => lanScore(b) - lanScore(a));
}

/**
 * Converte l'output di os.networkInterfaces() in candidati IPv4 esterni.
 * @param {NodeJS.Dict<import("node:os").NetworkInterfaceInfo[]>} interfaces
 * @returns {LanCandidate[]}
 */
export function lanCandidates(interfaces) {
  return Object.entries(interfaces).flatMap(([name, infos]) =>
    (infos ?? [])
      .filter((i) => i.family === "IPv4" && !i.internal)
      .map((i) => ({ name, address: i.address })),
  );
}
