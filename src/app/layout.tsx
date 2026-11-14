import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL, REPO_URL } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Hooky — Long story. Short form.",
  description:
    "Turn long videos into captioned shorts with Hooky. Find moments by topic, correct captions and save named projects in a free, open-source local Studio. Gemini powers AI selection.",
  keywords: [
    "Hooky",
    "AI video clipper",
    "open source opus clip alternative",
    "vertical video generator",
    "youtube shorts generator",
    "instagram reels generator",
    "faster-whisper",
    "gemini flash",
    "ffmpeg 9:16",
    "hormozi captions",
    "free video clipper",
    "local first video editor",
  ],
  authors: [{ name: "Pranav / Hooky Contributors", url: REPO_URL }],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Hooky",
    title: "Hooky — Long story. Short form.",
    description:
      "Find moments by topic, correct captions and save named projects. Hooky is an open-source video clipper with local rendering and Gemini-powered AI selection.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hooky — Long story. Short form. Free, open-source AI video clipping.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hooky — Long story. Short form.",
    description:
      "Find moments by topic, correct captions and save named projects. Hooky is an open-source video clipper with local rendering and Gemini-powered AI selection.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Hooky",
              applicationCategory: "MultimediaApplication",
              operatingSystem: "Linux, macOS, Windows",
              isAccessibleForFree: true,
              license: "https://opensource.org/licenses/MIT",
              description:
                "Open-source video clipper with topic-guided selection, editable captions, named local projects and FFmpeg rendering. AI selection uses your Gemini API key.",
              url: SITE_URL,
              codeRepository: REPO_URL,
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                description:
                  "Free MIT-licensed software. Gemini API pricing and quotas apply to AI selection.",
              },
            }),
          }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
