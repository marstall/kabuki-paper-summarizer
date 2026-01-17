import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  return (
    <html lang="en">
    <head>
      <meta charSet="utf-8"/>
      <script src="https://kit.fontawesome.com/a208fe4da2.js" crossOrigin="anonymous"></script>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@1.0.4/css/bulma.min.css"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
    </head>
    <body className={`${geistSans.variable} ${geistMono.variable}`}>
    <section className="section">
      <div className="container">
      {children}
      </div>
    </section>
    </body>
    </html>
  );
}
