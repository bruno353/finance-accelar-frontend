/* eslint-disable no-unused-vars */
'use client'

// import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import 'node_modules/react-modal-video/css/modal-video.css'
import '../styles/index.css'
import { Providers } from './providers'
import Header from '@/components/Header'
import { Web3Modal } from '@/contexts/Web3Modal'
import StarsCanvas from '@/components/Background'

export default function RootLayout({
  children,
}: {
  // eslint-disable-next-line no-undef
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body className="max-w-screen h-full w-full bg-[#16171C]">
        <Providers>
          <Web3Modal>
            {/* <StarsCanvas /> */}
            <Header />
            {children}
            <ScrollToTop />
          </Web3Modal>
        </Providers>
      </body>
    </html>
  )
}
