import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import "./article.css";
import SubscribeForm from "@/app/components/subscribe-form/subscribe-form";
import {SpeedInsights} from "@vercel/speed-insights/next"
import WelcomeOverlay from "@/app/components/welcome-overlay/welcome-overlay";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Kabuki Papers",
  description: "",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const ogImage = siteUrl ? `${siteUrl}/favicon.ico` : "/favicon.ico";
  const ogUrl = siteUrl || undefined;

  return (
    <html lang="en">
    <head>
      <meta charSet="utf-8"/>
      <meta property="og:site_name" content="The Kabuki Papers"/>
      <meta property="og:title" content="The Kabuki Papers"/>
      <meta property="og:description"
            content="AI-generated plain-English summaries of Kabuki syndrome research papers."/>
      <meta property="og:type" content="website"/>
      {ogUrl && <meta property="og:url" content={ogUrl}/>}
      <meta property="og:image" content={ogImage}/>
      <meta property="og:image:width" content="1200"/>
      <meta property="og:image:height" content="630"/>

      <meta name="twitter:card" content="summary_large_image"/>
      <meta name="twitter:title" content="The Kabuki Papers"/>
      <meta name="twitter:description"
            content="AI-generated plain-English summaries of Kabuki syndrome research papers."/>
      <meta name="twitter:image" content={ogImage}/>

      <script src="https://kit.fontawesome.com/a208fe4da2.js" crossOrigin="anonymous"></script>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bulma@1.0.4/css/bulma.min.css"
      />
      <link rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Playfair+Display&family=Merriweather"/>

      <meta name="viewport" content="width=device-width, initial-scale=1"/>
    </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
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
      </body>
    </html>
  );
}
