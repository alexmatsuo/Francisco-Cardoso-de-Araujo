import type { Metadata } from "next";
import "./globals.css";
import { ConditionalHeader } from "@/components/ConditionalHeader";
import { Footer } from "@/components/Footer";

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
      <body className="bg-black text-[#D3CEAD] antialiased font-sans flex flex-col min-h-screen">
        <div 
          className="fixed inset-0 z-[-1] simple-background"
          style={{
            backgroundImage: "url('/background.jpg')",
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>
        
        <ConditionalHeader />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}