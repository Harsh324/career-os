import type { Metadata } from "next";
import { getCareerSDK } from "@/lib/get-career-os";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const sdk = await getCareerSDK();
  const meta = sdk.meta();

  return {
    title: {
      default: `${meta.name} — ${meta.title}`,
      template: `%s | ${meta.name}`,
    },
    description: meta.summary || meta.tagline,
    keywords: ["Software Engineer", "Developer Portfolio", "TypeScript", "Career OS", "Monorepo"],
    authors: [{ name: meta.name }],
    creator: meta.name,
    metadataBase: new URL("https://career-os.dev"),
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://career-os.dev",
      title: `${meta.name} — ${meta.title}`,
      description: meta.summary || meta.tagline,
      siteName: `${meta.name} Portfolio`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.name} — ${meta.title}`,
      description: meta.summary || meta.tagline,
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
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-emerald-500/20 selection:text-emerald-300">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer meta={meta} />
        </div>
      </body>
    </html>
  );
}
