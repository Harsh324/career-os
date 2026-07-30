import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import { getCareerSDK } from "@/lib/get-career-os";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const sdk = await getCareerSDK();
  const meta = sdk.meta();

  return {
    title: {
      default: `${meta.name} — ${meta.title}`,
      template: `%s | ${meta.name}`,
    },
    description: meta.summary || meta.tagline,
    keywords: [
      "Backend & Cloud Engineer",
      "Backend Engineering",
      "Cloud Architecture",
      "Platform Engineering",
      "AWS",
      "Django",
      "PostgreSQL",
      "Docker",
      "Career OS",
      "Developer Tooling",
      "Distributed Systems",
    ],
    authors: [{ name: meta.name }],
    creator: meta.name,
    metadataBase: new URL("https://career-os.dev"),
    alternates: {
      canonical: "https://career-os.dev",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://career-os.dev",
      title: `${meta.name} — ${meta.title}`,
      description: meta.summary || meta.tagline,
      siteName: "Career OS Platform",
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.name} — ${meta.title}`,
      description: meta.summary || meta.tagline,
      creator: "@harsh324",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sdk = await getCareerSDK();
  const meta = sdk.meta();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: meta.name,
    jobTitle: meta.title,
    email: meta.email,
    description: meta.summary,
    url: "https://career-os.dev",
    sameAs: [meta.social?.github, meta.social?.linkedin, meta.social?.twitter].filter(Boolean),
    knowsAbout: [
      "Backend Engineering",
      "Cloud Architecture",
      "Django",
      "PostgreSQL",
      "AWS",
      "Docker",
      "Platform Engineering",
    ],
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen w-full overflow-x-hidden bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] antialiased selection:bg-[#2ea043]/30 selection:text-[#2ea043] transition-colors">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="flex min-h-screen w-full flex-col items-center">
            <Navbar name={meta.name} />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
