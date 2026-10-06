import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Sansita } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const outfit = DM_Sans({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const bebasNeue = Sansita({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "FORGE | Vending Inventory Optimizer",
  description: "Precision inventory optimization for industrial vending systems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Browser extensions can add attributes to this element before hydration.
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} ${bebasNeue.variable} antialiased font-[family-name:var(--font-outfit)]`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
