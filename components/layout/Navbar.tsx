import Link from "next/link";

const LINKS = [
  { href: "/vehicles", label: "Veicoli" },
  { href: "/compare", label: "Confronta" },
  { href: "/pricing", label: "Piani" },
] as const;

export function Navbar() {
  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
        <Link href="/" className="font-mono text-lg font-bold tracking-tight">
          Auto<span className="text-accent">Engineer</span>
        </Link>
        <ul className="flex gap-4 text-sm text-muted">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hover:text-fg">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
