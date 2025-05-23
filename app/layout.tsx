import "bootstrap/dist/css/bootstrap.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import { GlobalProvider } from "./GlobalProvider";
import Script from "next/script";
import Footer from "@/components/layout/footer/Footer";
import ChatWidget from "@/components/chat-bot/Chatbot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "परिवार",
  description: "परिवार",
  other: {
    // in order for the app to be open from third party sources, e.g. facebook messangers, whats app messangers etc.
    "al:web:url": "https://neupaneparibar.vercel.app/",
    "al:web:should_fallback": "false",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GlobalProvider>
          <div className="header-children-spacing">
            <Header />
            {children}
            <ChatWidget />
            <Footer />
          </div>
        </GlobalProvider>
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></Script>
        <Script src="https://kit.fontawesome.com/9edb65c86a.js"></Script>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/remixicon@4.6.0/fonts/remixicon.min.css"
        />
      </body>
    </html>
  );
}
