import type { Metadata } from "next"
import { Barlow_Condensed, Space_Mono, Plus_Jakarta_Sans } from "next/font/google"
import { Providers } from "@/shared/components/Providers"
import "./globals.css"

// Headline font: Barlow Condensed — matches the industrial/brutalist aesthetic
const barlowCondensed = Barlow_Condensed({
  weight: "900",
  subsets: ["latin"],
  variable: "--font-headline",
  display: "swap",
})

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
})

const plusJakarta = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
})

export const metadata: Metadata = {
  title: "BondIQ — Relationship Intelligence",
  description: "AI-powered memory for every relationship that matters.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BondIQ",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    title: "BondIQ — Relationship Intelligence",
    description: "AI-powered memory for every relationship that matters.",
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${spaceMono.variable} ${plusJakarta.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#CCFF00" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BondIQ" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body style={{ background: '#000000', color: '#FFFFFF', fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)" }}>
        <Providers>{children}</Providers>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(reg) { console.log('SW registered:', reg.scope); })
                    .catch(function(err) { console.log('SW registration failed:', err); });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
