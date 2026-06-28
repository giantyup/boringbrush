import type { Metadata } from "next";
import { Fraunces, DM_Sans, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";
import { SITE } from "@/lib/site";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name}: Digital avatars, printed into reality`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "3D printed avatars",
    "hand painted collectibles",
    "Bored Apes figures",
    "custom avatar prints",
    "BoringBrush",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name}: Digital avatars, printed into reality`,
    description: SITE.description,
    url: SITE.url,
    images: [{ url: "/og-default.png", width: 600, height: 500, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@BoringBrush",
    title: `${SITE.name}: Digital avatars, printed into reality`,
    description: SITE.description,
    images: ["/og-default.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${dmSans.variable} ${bricolage.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-sky text-ink">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#f0ddc2",
              color: "#211e1c",
              border: "2px solid #211e1c",
              borderRadius: "0.75rem",
            },
          }}
        />
      </body>
    </html>
  );
}
