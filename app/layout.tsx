import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import dynamic from 'next/dynamic'

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false })

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ADFLO - Traffic Marketplace',
  description: 'Premium traffic marketplace for buyers and sellers. Clean and Private lanes available.',
  keywords: ['traffic', 'marketplace', 'advertising', 'ADFLO', 'traffic source'],
  authors: [{ name: 'ADFLO' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0284c7',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-gray-900 text-white py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">ADFLO</h3>
                  <p className="text-gray-400 text-sm">
                    Premium traffic marketplace connecting buyers and sellers worldwide.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-4 uppercase">Platform</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li><a href="/listings" className="hover:text-white transition-colors">Browse Listings</a></li>
                    <li><a href="/auth/register" className="hover:text-white transition-colors">Become a Seller</a></li>
                    <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-4 uppercase">Support</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                    <li><a href="/disputes" className="hover:text-white transition-colors">Dispute Resolution</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-4 uppercase">Company</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                <p>&copy; {new Date().getFullYear()} ADFLO Traffic Marketplace. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
