import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import { profile } from "@/content/site";
import { getSiteUrl } from "@/lib/siteUrl";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-face",
  display: "swap",
});

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display-face",
  display: "swap",
});

const description =
  "AI Fullstack Engineer with 3 years shipping production AI: RAG over PostgreSQL/pgvector, multi-provider LLM pipelines, and high-volume document systems across healthcare, fintech, legal-tech and government fundraising.";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s — ${profile.name}`,
  },
  description,
  keywords: [
    "AI engineer",
    "fullstack engineer",
    "RAG",
    "pgvector",
    "LLM",
    "NestJS",
    "Next.js",
    "Node.js",
    "vector search",
    "Astha Niharika",
  ],
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: `${profile.name} — Portfolio`,
    title: `${profile.name} — ${profile.role}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: siteUrl },
};

export const viewport: Viewport = {
  themeColor: "#08090a",
  colorScheme: "dark",
};

/**
 * Person schema so Google can render a rich result for her name —
 * this is the concrete lever on "outstanding reach".
 */
function StructuredData() {
  const json = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    email: profile.email,
    url: siteUrl,
    address: { "@type": "PostalAddress", addressLocality: "Bhubaneswar", addressCountry: "IN" },
    sameAs: [profile.socials.github, profile.socials.linkedin],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Veer Surendra Sai University of Technology",
    },
    worksFor: { "@type": "Organization", name: "Hyscaler" },
    knowsAbout: [
      "Retrieval-Augmented Generation",
      "Large Language Models",
      "Vector databases",
      "Node.js",
      "NestJS",
      "Next.js",
      "PostgreSQL",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} ${display.variable}`}>
      <head>
        {/*
          Scroll-reveal sections are server-rendered with inline opacity:0 and
          only animate once framer-motion hydrates. If JS never arrives, this
          forces every one of them visible so the page is always readable.
        */}
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="grain">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-gold-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink-950"
        >
          Skip to content
        </a>
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
