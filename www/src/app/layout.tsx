import type {Metadata} from "next";
import Script from "next/script";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import "./article.css";
import SubscribeForm from "@/app/components/subscribe-form/subscribe-form";
import {SpeedInsights} from "@vercel/speed-insights/next"
import WelcomeOverlay from "@/app/components/welcome-overlay/welcome-overlay";
import PlausibleProvider from 'next-plausible'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | The Kabuki Papers",
    absolute: "The Kabuki Papers"
  },
  keywords: ["kabuki","kabuki syndrome"],
  creator: "Chris Marstall",
  metadataBase: new URL('https://www.thekabukipapers.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "The Kabuki Papers",
    description: "The science of Kabuki Syndrome, illuminated by AI",
    url: 'https://www.thekabukipapers.org',
    images: [
      {
        url: "https://www.thekabukipapers.org/site_logo_1200x630.png",
        width: 1200,
        height: 630
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: "summary_large_image",
    title:"The Kabuki Papers",
    description:"The science of Kabuki Syndrome, illuminated by AI",
    images: ["https://www.thekabukipapers.org/site_logo_1200x630.png"],
  },

};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  // const ogImage = siteUrl ? `${siteUrl}/favicon.ico` : "/favicon.ico";
  // const ogUrl = siteUrl || undefined;

  return (
    <html lang="en">
    <head>
      <meta charSet="utf-8"/>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bulma@1.0.4/css/bulma.min.css"
      />

      <meta name="viewport" content="width=device-width, initial-scale=1"/>
    </head>
    <body>
    {/*<PlausibleProvider domain="thekabukipapers.org">*/}
    <div className="page subscribeBar">
        <div className="pageInner">
          <WelcomeOverlay/>
          <SubscribeForm/>
        </div>
      </div>
      <div className="page">
        <div className="pageInner pageContent">
          {children}
        </div>
      </div>
    {/*</PlausibleProvider>*/}
    </body>
    </html>
  );
}
