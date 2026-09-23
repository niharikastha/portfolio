import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Mono, Fraunces } from "next/font/google";
import { profile } from "@/content/site";
import { getSiteUrl } from "@/lib/siteUrl";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans-face",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono-face",
  display: "swap",
});

const display = Fraunces({
  subsets: ["latin"],
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
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#08090a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark light",
};

/**
 * Runs before first paint: use the visitor's saved choice, else their OS
 * setting. Without this the page would flash dark before switching to light.
 */
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.dataset.theme=t}catch(e){}})()`;

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
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${display.variable}`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
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
