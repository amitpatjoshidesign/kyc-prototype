import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Agentation } from "agentation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KYC Prototype",
  description: "Know Your Customer verification prototype",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
      <body className={`${inter.className} antialiased`}>
        {children}
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
