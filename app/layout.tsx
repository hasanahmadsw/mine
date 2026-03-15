import type { Metadata } from "next";
import { Cairo, Mona_Sans } from "next/font/google";
import { seoConfig } from "@/utils/seo/seo.config";

const mona_sans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(seoConfig.siteURL),
  applicationName: seoConfig.siteName,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${mona_sans.variable} ${cairo.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
