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
        {/* Background container that adapts to viewport */}
        <div 
          className="fixed inset-0 z-[-1] w-full h-full"
          style={{
            backgroundImage: "url('/background.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh',
            minWidth: '100vw',
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>
        
        <ConditionalHeader />
        <main className="flex-1 relative z-0">{children}</main>
        <Footer />
      </body>
    </html>
  );
}