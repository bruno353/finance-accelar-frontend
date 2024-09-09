'use client'

import ScrollUp from '@/components/Common/ScrollUp'
import DepinDeployment from '@/components/NewDepin/deployment'
import Stock from '@/components/Synthetics/stock'
import Workspace from '@/components/Workspace'
import { Inter } from '@next/font/google'

// eslint-disable-next-line no-unused-vars
const inter = Inter({ subsets: ['latin'] })

export default function Page({ params }) {
  console.log(params.id)
  return (
    <>
      <ScrollUp />
      <Stock id={params.id} />
    </>
  )
}
