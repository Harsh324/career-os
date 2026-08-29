import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import { fetchSiteSettings } from "@/lib/api/services";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { AnalyticsProvider } from "@/providers/AnalyticsProvider";
import { DEFAULT_SITE_SETTINGS } from "@/lib/constants/site";
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
  let meta = DEFAULT_SITE_SETTINGS;

  try {
    const fetched = await fetchSiteSettings();
    if (fetched) meta = { ...meta, ...fetched };
  } catch (err) {
    // Fallback to static meta if API is not running during build
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://career-os.dev";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${meta.name} | Backend & Cloud Engineer`,
      template: `%s | ${meta.name}`,
    },
    description: meta.summary || meta.tagline,
    keywords: [
      "Backend & Cloud Engineer",
      "Backend Engineering",
      "Cloud Architecture",
      "Platform Engineering",
      "AWS",
      "Django REST Framework",
      "PostgreSQL",
      "Celery",
      "ECS Fargate",
      "Distributed Systems",
    ],
    authors: [{ name: meta.name }],
    creator: meta.name,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      siteName: `${meta.name} | Backend & Cloud Engineer`,
      title: `${meta.name} | Backend & Cloud Engineer`,
      description: meta.summary || meta.tagline,
      images: [
        {
          url: meta.avatar_url || "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${meta.name} — Backend & Cloud Engineer (Python, Django REST, AWS, Celery, PostgreSQL)`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.name} | Backend & Cloud Engineer`,
      description: meta.summary || meta.tagline,
      creator: "@harsh324",
      images: [meta.avatar_url || "/og-image.png"],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let meta = DEFAULT_SITE_SETTINGS;

  try {
    const fetched = await fetchSiteSettings();
    if (fetched) meta = { ...meta, ...fetched };
  } catch (err) {
    // Fallback
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: meta.name,
    jobTitle: meta.title,
    description: meta.summary,
    url: "https://career-os.dev",
    sameAs: [meta.github_url, meta.linkedin_url, meta.twitter_url].filter(Boolean),
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
      <body className="min-h-screen w-full overflow-x-hidden bg-[#f6f8fa] dark:bg-[#0d1117] text-[#24292f] dark:text-[#f0f6fc] antialiased selection:bg-[#2ea043]/30 selection:text-[#2ea043] transition-colors">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <AnalyticsProvider>
              <div className="flex min-h-screen w-full flex-col items-center">
                <Navbar name={meta.name} title={meta.title} />
                <main className="flex-1 w-full">{children}</main>
                <Footer />
                <ChatWidget />
              </div>
            </AnalyticsProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
