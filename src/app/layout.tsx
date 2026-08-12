import type { Metadata } from "next";
import { Exo_2, IBM_Plex_Sans, Syne } from "next/font/google";
import Script from "next/script";
import { Providers } from "@/components/providers";
import "./globals.css";

const plex = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700", "800"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://replybase-sigma.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Replybase — Embeddable chatbot from your docs",
  description:
    "Upload your product docs. Get an in-app assistant and an embeddable website widget that answers from your knowledge base.",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    apple: [{ url: "/apple-icon.png" }],
  },
  openGraph: {
    title: "Replybase — Embeddable chatbot from your docs",
    description:
      "Upload your product docs. Get an in-app assistant and an embeddable website widget that answers from your knowledge base.",
    url: "/",
    siteName: "Replybase",
    images: [{ url: "/og.webp", width: 1200, height: 630, alt: "Replybase" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Replybase — Embeddable chatbot from your docs",
    description:
      "Upload your product docs. Get an in-app assistant and an embeddable website widget.",
    images: ["/og.webp"],
  },
};

const themeBoot = `(function(){try{var d=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",d);var l=localStorage.getItem("replybase-locale");if(l==="en"||l==="ru"){document.documentElement.lang=l;document.documentElement.setAttribute("data-locale",l);}else{document.documentElement.setAttribute("data-locale","en");}}catch(e){document.documentElement.setAttribute("data-theme","light");document.documentElement.setAttribute("data-locale","en");}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-locale="en" suppressHydrationWarning>
      <body
        className={`${plex.variable} ${syne.variable} ${exo2.variable} antialiased`}
      >
        <Script id="theme-boot" strategy="beforeInteractive">
          {themeBoot}
        </Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
