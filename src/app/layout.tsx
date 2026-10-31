import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL, REPO_URL } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Hooky — One long video. Only the good parts.",
  description:
    "100% Free & Open-Source (MIT) autonomous AI video clipper. Turn long videos, podcasts, and interviews into high-retention vertical 9:16 shorts with Gemini semantic narrative detection, faster-whisper animated captions, and local FFmpeg encoding.",
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
    title: "Hooky — One long video. Only the good parts.",
    description:
      "Autonomous AI video clipper. Reframes for vertical video and burns word-level animated captions—without sending your raw footage to a cloud.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Hooky — One long video. Only the good parts.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hooky — One long video. Only the good parts.",
    description:
      "Autonomous AI video clipper. Reframes for vertical video and burns word-level animated captions—without sending your raw footage to a cloud.",
    images: ["/og-image.svg"],
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
                "Autonomous AI video clipper and shorts/reels generator. Open-source Opus Clip alternative powered by Google Gemini, faster-whisper, and FFmpeg.",
              url: SITE_URL,
              codeRepository: REPO_URL,
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                description: "100% Free & Open Source under MIT License",
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
