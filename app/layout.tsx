import type React from "react"
import type { Metadata } from "next"
import { Bricolage_Grotesque, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react"
import Script from "next/script"
import { CurrencyProvider } from "@/lib/currency"
import { VersionLogger } from "@/components/version-logger"
import "./globals.css"

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
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
      <body className={`${display.variable} ${inter.variable} font-inter antialiased`}>
        {/* Google Translate rewrites text nodes inside React-managed elements; without
            these guards React can crash (removeChild/insertBefore on foreign nodes)
            whenever state updates re-render translated text. */}
        <Script
          id="translate-dom-guard"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof Node === 'function' && Node.prototype) {
                var origRemoveChild = Node.prototype.removeChild;
                Node.prototype.removeChild = function(child) {
                  if (child.parentNode !== this) return child;
                  return origRemoveChild.apply(this, arguments);
                };
                var origInsertBefore = Node.prototype.insertBefore;
                Node.prototype.insertBefore = function(newNode, referenceNode) {
                  if (referenceNode && referenceNode.parentNode !== this) return newNode;
                  return origInsertBefore.apply(this, arguments);
                };
              }
            `,
          }}
        />
        <Script
          id="google-translate-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.googleTranslateElementInit = function() {
                try {
                  new google.translate.TranslateElement({
                    pageLanguage: 'en',
                    includedLanguages: 'en,fr,ar,zh-CN,ru,es,de,it,pt,ja,ko',
                    autoDisplay: false
                  }, 'google_translate_element');
                } catch (error) {
                  console.error('Google Translate init error:', error);
                }
              };
            `,
          }}
        />
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />

        <div id="google_translate_element" style={{ display: "none" }}></div>

        <CurrencyProvider defaultCurrency="EUR" defaultLocale="en-SC">
          <Suspense fallback={null}>{children}</Suspense>
        </CurrencyProvider>

        <VersionLogger />
        <Analytics />
      </body>
    </html>
  )
}
