import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LazyMotion, domAnimation } from "framer-motion";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
});

const SITE_URL = "https://personalpieceportfolio.akashgogate.com";
const TITLE = "Akash Gogate — Software Engineer & Researcher";
const DESCRIPTION =
  "CS + Biology student at UW-Madison, working on distributed systems and biological data science.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: TITLE,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Akash Gogate",
  url: SITE_URL,
  jobTitle: "Software Engineer & Researcher",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Wisconsin-Madison",
  },
  sameAs: [
    "https://github.com/AkashGogate",
    "https://www.linkedin.com/in/akash-gogate",
  ],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth dark" suppressHydrationWarning>
      <body className={`${playfair.variable} ${inter.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
        <ThemeProvider>
          <LazyMotion features={domAnimation}>{children}</LazyMotion>
        </ThemeProvider>
      </body>
    </html>
  );
}
