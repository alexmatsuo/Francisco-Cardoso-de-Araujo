import type { Metadata } from "next";
import { Inter, Calistoga } from 'next/font/google';
import "./globals.css";
import { twMerge } from "tailwind-merge";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const calistoga = Calistoga({ subsets: ['latin'], variable: '--font-serif', weight: '400' });

export const metadata: Metadata = {
  title: "Francisco Cardoso de Araujo",
  description: "Composer, Researcher",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={twMerge(
          inter.variable, 
          calistoga.variable, 
          "bg-gray-900 text-white antialiased font-sans flex flex-col min-h-screen"
        )}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
