import type { Metadata } from "next"
import { Cormorant_Garamond, Inter } from "next/font/google"
import { getStoreSettings } from "@/lib/settings-store"
import { StoreSettingsProvider } from "@/components/StoreSettingsProvider"
import CartSettingsSync from "@/components/CartSettingsSync"
import { DEFAULT_STORE_SETTINGS } from "@/lib/settings"
import "./globals.css"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: { default: "Off the Hook", template: "%s | Off the Hook" },
  description: "Cape Town's freshest catch, door to door. Daily linefish, shellfish & crayfish — ordered in 60 seconds on WhatsApp.",
  keywords: ["fresh fish Cape Town", "seafood delivery", "Cape Town fish", "Hout Bay", "Kalk Bay"],
  icons: {
    icon: "/images/logo.svg",
    apple: "/images/logo.svg",
  },
  openGraph: {
    siteName: "Off the Hook",
    locale: "en_ZA",
    type: "website",
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getStoreSettings().catch(() => DEFAULT_STORE_SETTINGS)

  return (
    <html lang="en-ZA" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-vula-cream text-vula-dark antialiased">
        <StoreSettingsProvider settings={settings}>
          <CartSettingsSync />
          {children}
        </StoreSettingsProvider>
      </body>
    </html>
  )
}
