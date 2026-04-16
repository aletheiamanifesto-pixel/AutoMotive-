import type { Metadata } from "next";
import { Inter, Racing_Sans_One, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const racing = Racing_Sans_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "AutoEngineer Academy | Studia le Auto come un Ingegnere",
  description:
    "La piattaforma dove studiare l'ingegneria automobilistica e sbloccare esperienze reali nel mondo automotive con sconti fino al 50%.",
  keywords: ["automotive", "engineering", "cars", "motori", "ingegneria", "track day", "supercar"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={`${inter.variable} ${racing.variable} ${jetbrains.variable}`}> 
      <body className="noise-overlay min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
