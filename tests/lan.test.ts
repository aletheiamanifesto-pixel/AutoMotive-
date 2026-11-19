import { describe, expect, it } from "vitest";
import { lanCandidates, rankLanAddresses } from "../scripts/lan.mjs";

describe("scelta dell'indirizzo per il telefono", () => {
  it("PC Windows con Hyper-V/WSL e VirtualBox: vince il Wi-Fi vero", () => {
    // Caso reale: ipconfig con vEthernet (Default Switch), Ethernet 2 di VirtualBox e Wi-Fi
    const ranked = rankLanAddresses([
      { name: "vEthernet (Default Switch)", address: "172.28.16.1" },
      { name: "Ethernet 2", address: "192.168.56.1" },
      { name: "Wi-Fi", address: "192.168.1.185" },
    ]);
    expect(ranked.map((c) => c.address)).toEqual(["192.168.1.185", "192.168.56.1", "172.28.16.1"]);
  });

  it("Ethernet via cavo senza Wi-Fi: resta la scheda fisica", () => {
    const ranked = rankLanAddresses([
      { name: "vEthernet (WSL)", address: "172.20.0.1" },
      { name: "Ethernet", address: "192.168.0.12" },
    ]);
    expect(ranked[0]?.address).toBe("192.168.0.12");
  });

  it("rete aziendale 10.x preferita a Docker", () => {
    const ranked = rankLanAddresses([
      { name: "docker0", address: "172.17.0.1" },
      { name: "eth0", address: "10.0.4.20" },
    ]);
    expect(ranked[0]?.address).toBe("10.0.4.20");
  });

  it("lanCandidates tiene solo IPv4 non interni", () => {
    const candidates = lanCandidates({
      lo: [{ address: "127.0.0.1", family: "IPv4", internal: true, netmask: "", mac: "", cidr: null }],
      "Wi-Fi": [
        { address: "192.168.1.185", family: "IPv4", internal: false, netmask: "", mac: "", cidr: null },
        { address: "fe80::1", family: "IPv6", internal: false, netmask: "", mac: "", cidr: null, scopeid: 6 },
      ],
    });
    expect(candidates).toEqual([{ name: "Wi-Fi", address: "192.168.1.185" }]);
  });
});
