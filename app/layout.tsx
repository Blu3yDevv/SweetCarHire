import type React from "react"
import type { Metadata } from "next"
import { Nunito, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react"
import Script from "next/script"
import { CurrencyProvider } from "@/lib/currency"
import { VersionLogger } from "@/components/version-logger"
import "./globals.css"

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Sweet Car Hire - Drive Mahé Your Way | Seychelles Car Rental",
  description:
    "Escape through the sweetness of the island with Sweet Car Hire. Airport delivery, unlimited mileage, no hidden fees. Book your Seychelles car rental today.",
  generator: "v0.app",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${inter.variable} font-inter antialiased`}>
        <Script
          id="google-translate-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.googleTranslateElementInit = function() {
                try {
                  if (typeof google !== 'undefined' && google.translate && google.translate.TranslateElement) {
                    new google.translate.TranslateElement({
                      pageLanguage: 'en',
                      includedLanguages: 'en,fr,ar,zh,ru,es,de,it,pt,ja,ko',
                      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                      autoDisplay: false,
                      multilanguagePage: true
                    }, 'google_translate_element');
                    
                    // Force translate class on all text elements
                    setTimeout(() => {
                      const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, label, li, td, th, div');
                      elements.forEach(el => {
                        if (!el.classList.contains('notranslate') && !el.classList.contains('goog-te-')) {
                          el.classList.add('translate');
                        }
                      });
                    }, 1000);
                  } else {
                    setTimeout(window.googleTranslateElementInit, 1000);
                  }
                } catch (error) {
                  console.error('[v0] Google Translate error:', error);
                  setTimeout(window.googleTranslateElementInit, 2000);
                }
              };
              
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => setTimeout(window.googleTranslateElementInit, 500));
              } else {
                setTimeout(window.googleTranslateElementInit, 500);
              }
            `,
          }}
        />
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />

        <div id="google_translate_element" style={{ display: "none" }}></div>

        <VersionLogger />

        <CurrencyProvider defaultCurrency="EUR" defaultLocale="en-SC">
          <Suspense fallback={null}>{children}</Suspense>
        </CurrencyProvider>

        <Analytics />
      </body>
    </html>
  )
}
