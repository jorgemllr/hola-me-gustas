import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "hola me gustas",
  description: "Un plan de cita especial para el sábado ✨",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "hola me gustas",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "hola me gustas",
    description: "Un plan de cita especial para el sábado ✨",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#111111",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
