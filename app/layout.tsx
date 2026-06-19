import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { ShortlistProvider } from "@/context/ShortlistContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
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
  title: "LegalEase",
  description: "LegalEase platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-base-100 text-base-content font-sans flex flex-col">
        <AuthProvider>
          <ShortlistProvider>
            <ThemeProvider>
              <Navbar />
              <div className="flex-1">{children}</div>
              <Footer />
            </ThemeProvider>
          </ShortlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
