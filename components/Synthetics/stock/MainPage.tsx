/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unknown-property */
/* eslint-disable dot-notation */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
'use client'
// import { useState } from 'react'
import { useEffect, useState, ChangeEvent, FC, useContext, useRef } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Eye, EyeSlash, SmileySad } from 'phosphor-react'
import * as Yup from 'yup'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css' // import styles
import 'react-datepicker/dist/react-datepicker.css'
import { parseCookies } from 'nookies'
import { AccountContext } from '../../../contexts/AccountContext'
// import NewWorkspaceModal from './NewWorkspace'
import { getBlockchainApps, getUserWorkspace, getWorkspace } from '@/utils/api'
import { WorkspaceProps } from '@/types/workspace'
import SubNavBar from '../../Modals/SubNavBar'
import { Logo } from '../../Sidebar/Logo'
import { BlockchainWalletProps } from '@/types/blockchain-app'
import { getBlockchainWallets } from '@/utils/api-blockchain'
// import NewAppModal from './Modals/NewAppModal'
import Editor, { useMonaco } from '@monaco-editor/react'
import Dropdown, { ValueObject } from '../../Modals/Dropdown'
import { depinOptionsFeatures, depinOptionsNetwork } from '@/types/consts/depin'
import { callAxiosBackend } from '@/utils/general-api'
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import {
  DepinDeploymentProps,
  LeasesProps,
  NewDepinDeploymentProps,
} from '@/types/depin'
import {
  blockHeightToDate,
  formatDate,
  transformString,
  wait,
} from '@/utils/functions'
import { useAccount } from 'wagmi'
import { getDataHP, getVolume } from '../MainPage'
import { assetToStyle, SynAsset, syntethicAssets } from '../Assets'
import TradingViewChart from './TradingViewChart'

const MainPage = ({ id }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingCompilation, setIsLoadingCompilation] = useState(false)
  const [subMenuOption, setSubMenuOption] = useState<string>('Lease')
  const [isRotated, setIsRotated] = useState(false)

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [value, setValue] = useState('// start your code here')
  const [languageSelectorOpen, setLanguageSelectorOpen] = useState(false)
  const monaco = useMonaco()
  const [depin, setDepin] = useState<NewDepinDeploymentProps>()
  const [synthetic, setSynthetic] = useState<SynAsset>()
  const [provider, setProvider] = useState<any>()

  const [selected, setSelected] = useState<ValueObject>(depinOptionsFeatures[0])
  const [selectedNetwork, setSelectedNetwork] = useState<ValueObject>(
    depinOptionsNetwork[0],
  )

  const { address, chain } = useAccount()

  const [navBarSelected, setNavBarSelected] = useState('Deployments')
  const [blockchainWallets, setBlockchainWallets] = useState<
    BlockchainWalletProps[]
  >([])

  const {
    workspace,
    user,
    isDeployingNewDepinFeature,
    setIsDeployingNewDepingFeature,
  } = useContext(AccountContext)

  const { push } = useRouter()
  const pathname = usePathname()

  const editorRef = useRef()
  const [language, setLanguage] = useState('')

  interface CurrencyValue {
    currency: string
    value: string
  }

  const [fundAmount, setFundAmount] = useState<CurrencyValue[]>()
  const [usdAmount, setUsdAmount] = useState('0.0')

  const onMount = (editor) => {
    editorRef.current = editor
    editor.focus()
  }
  const menuRef = useRef(null)

  // async function getData() {
  //   setIsLoading(true)

  //   try {
  //     const config = {
  //       method: `get`,
  //       url: `https://api.akashnet.net/akash/deployment/v1beta3/deployments/list?filters.owner=akash1c3er49222vygzm6g4djr52muf3mspqam6cpqpy&pagination.limit=1000&filters.dseq=17511329&pagination.count_total=true`,
  //     }

  //     let finalData

  //     try {
  //       await axios(config).then(function (response) {
  //         if (response.data) {
  //           finalData = response.data
  //           console.log('api response')
  //           console.log(finalData)
  //         }
  //       })
  //     } catch (err) {
  //       console.log(err)
  //     }

  //     const config2 = {
  //       method: `get`,
  //       url: `https://api.akashnet.net/akash/market/v1beta4/leases/list?filters.owner=akash1c3er49222vygzm6g4djr52muf3mspqam6cpqpy&filters.dseq=17511329&pagination.limit=1000&pagination.count_total=true`,
  //     }

  //     let finalDataLeases

  //     try {
  //       await axios(config2).then(function (response) {
  //         if (response.data) {
  //           finalDataLeases = response.data
  //           console.log('api response')
  //           console.log(finalData)
  //         }
  //       })
  //     } catch (err) {
  //       console.log(err)
  //     }

  //     let finalProviders

  //     try {
  //       finalProviders = await callAxiosBackend(
  //         'get',
  //         `/blockchain/depin/functions/getAkashProviders`,
  //         'userSessionToken',
  //       )
  //     } catch (err) {
  //       console.log(err)
  //     }

  //     // finding the provider
  //     const provider = finalProviders?.find(
  //       (pv) =>
  //         pv.owner === finalDataLeases?.leases[0]?.lease?.lease_id?.provider,
  //     )

  //     setLease(finalDataLeases?.leases[0])
  //     setDepin(finalData?.deployments[0]) //
  //     setProvider(provider)
  //     // getting leases
  //   } catch (err) {
  //     console.log(err)
  //     toast.error(`Error: ${err}`)
  //   }

  //   setIsLoading(false)
  // }

  async function getData() {
    console.log('the id to search')
    console.log(id)
    const asset = syntethicAssets.find((att) => att.ticker === id)
    console.log('achei o asset')
    console.log(asset)
    setIsLoading(true)

    try {
      const volumeHorizonProtocol = await getVolume()
      const res = await getDataHP(asset.stickerPricing)
      asset.price = res?.latestPrice
      asset.change24h = Number(res?.priceChangePercent)
      asset.priceArray24h = res?.priceArray24h
      asset.volume =
        Number(
          (
            Number(
              volumeHorizonProtocol?.data?.zassetTradingVolumes[0]?.finalAmount,
            ) /
            10 ** 18
          ).toFixed(2),
        ) || 0
      setSynthetic(asset)
    } catch (err) {
      console.log(err)
      toast.error(`Error: ${err}`)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    getData()
  }, [address])

  const subMenu = ['Lease', 'Console']

  const uptimePercentage = provider
    ? (provider.uptime7d * 100 - 1).toFixed(0)
    : 0
  const downtimePercentage = 100 - Number(uptimePercentage)
  const COLORS = ['#FE886D', '#6FD572'] // Green for uptime, Orange for downtime

  const data = [
    { name: 'Uptime', value: uptimePercentage },
    { name: 'Downtime', value: downtimePercentage },
  ]

  const nameRef = useRef(null)

  function handleValues(currency: string, value: string) {
    const newFundAmount = [...fundAmount]

    const index = newFundAmount.findIndex((nw) => nw.currency === currency)
    if (!isLoading) {
      // Esta expressão regular permite apenas números
      const regex = /^\d*\.?\d*$/

      if (regex.test(value)) {
        newFundAmount[index].value = value
        setFundAmount(newFundAmount)
      }
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (nameRef.current && !nameRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  if (isLoading) {
    return (
      <div className="container grid w-full gap-y-[30px]  text-[16px] md:pb-20 lg:pb-28 lg:pt-40">
        <div className="h-20 w-full animate-pulse rounded-[5px] bg-[#1d1f23b6]"></div>
        <div className="h-40 w-full animate-pulse rounded-[5px] bg-[#1d1f23b6]"></div>
      </div>
    )
  }

  return (
    <>
      <section className="relative z-10 h-full overflow-hidden  pb-5 pt-2 lg:pt-40">
        <div className="container px-12">
          <div className="relative flex gap-x-9">
            <div className="relative flex w-fit items-center gap-x-4">
              <img
                onClick={() => {
                  push(`/feats/depin`)
                }}
                alt="image"
                src="/images/explore/arrow.svg"
                className={`w-10 rotate-180 cursor-pointer rounded-md p-3 hover:bg-grayPale`}
              />
              <div className="flex items-center gap-x-3">
                <img
                  alt="delete"
                  src={assetToStyle[synthetic?.name]?.imgSource}
                  className={assetToStyle[synthetic?.name]?.imgStyleBig}
                ></img>
                <div className="text-2xl font-medium text-white">
                  {synthetic?.ticker}
                </div>
              </div>

              <div className="absolute -right-5 top-1 h-2 w-2 animate-pulse rounded-full bg-[#6FD572]"></div>
            </div>
            <div className="relative">
              <div
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen)
                }}
                className="my-auto flex h-fit cursor-pointer items-center rounded-md p-2 pt-0 text-center font-bold text-white hover:bg-[#7775840c]"
              >
                . . .
              </div>
              {isMenuOpen && (
                <div
                  ref={nameRef}
                  className="absolute -right-32 -top-0 grid min-w-[130px] gap-y-[1px] rounded-md border-[1px] border-[#c9c9cb10] bg-[#212225] px-2 py-1 text-sm text-white"
                >
                  <div className="flex cursor-pointer items-center gap-x-2 rounded-md px-1 py-2 hover:bg-grayPale">
                    <img
                      alt="image"
                      src="/images/explore/add.svg"
                      className="w-5"
                    />

                    <div>Add fund</div>
                  </div>
                  <div className="flex cursor-pointer items-center gap-x-2 rounded-md px-1 py-2 hover:bg-grayPale">
                    <img
                      alt="image"
                      src="/images/explore/close.svg"
                      className="w-5"
                    />

                    <div>Close</div>
                  </div>
                </div>
              )}
            </div>
            <div className="absolute right-0 top-0 z-[-1] rotate-180">
              <svg
                width="79"
                height="94"
                viewBox="0 0 79 94"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  opacity="0.3"
                  x="-41"
                  y="26.9426"
                  width="66.6675"
                  height="66.6675"
                  transform="rotate(-22.9007 -41 26.9426)"
                  fill="url(#paint0_linear_94:889)"
                />
                <rect
                  x="-41"
                  y="26.9426"
                  width="66.6675"
                  height="66.6675"
                  transform="rotate(-22.9007 -41 26.9426)"
                  stroke="url(#paint1_linear_94:889)"
                  strokeWidth="0.7"
                />
                <path
                  opacity="0.3"
                  d="M50.5215 7.42229L20.325 1.14771L46.2077 62.3249L77.1885 68.2073L50.5215 7.42229Z"
                  fill="url(#paint2_linear_94:889)"
                />
                <path
                  d="M50.5215 7.42229L20.325 1.14771L46.2077 62.3249L76.7963 68.2073L50.5215 7.42229Z"
                  stroke="url(#paint3_linear_94:889)"
                  strokeWidth="0.7"
                />
                <path
                  opacity="0.3"
                  d="M17.9721 93.3057L-14.9695 88.2076L46.2077 62.325L77.1885 68.2074L17.9721 93.3057Z"
                  fill="url(#paint4_linear_94:889)"
                />
                <path
                  d="M17.972 93.3057L-14.1852 88.2076L46.2077 62.325L77.1884 68.2074L17.972 93.3057Z"
                  stroke="url(#paint5_linear_94:889)"
                  strokeWidth="0.7"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_94:889"
                    x1="-41"
                    y1="21.8445"
                    x2="36.9671"
                    y2="59.8878"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#4A6CF7" stopOpacity="0.62" />
                    <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_94:889"
                    x1="25.6675"
                    y1="95.9631"
                    x2="-42.9608"
                    y2="20.668"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#4A6CF7" stopOpacity="0" />
                    <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.51" />
                  </linearGradient>
                  <linearGradient
                    id="paint2_linear_94:889"
                    x1="20.325"
                    y1="-3.98039"
                    x2="90.6248"
                    y2="25.1062"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#4A6CF7" stopOpacity="0.62" />
                    <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    id="paint3_linear_94:889"
                    x1="18.3642"
                    y1="-1.59742"
                    x2="113.9"
                    y2="80.6826"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#4A6CF7" stopOpacity="0" />
                    <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.51" />
                  </linearGradient>
                  <linearGradient
                    id="paint4_linear_94:889"
                    x1="61.1098"
                    y1="62.3249"
                    x2="-8.82468"
                    y2="58.2156"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#4A6CF7" stopOpacity="0.62" />
                    <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    id="paint5_linear_94:889"
                    x1="65.4236"
                    y1="65.0701"
                    x2="24.0178"
                    y2="41.6598"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#4A6CF7" stopOpacity="0" />
                    <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.51" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div className="flex gap-x-24">
            <div className="grid gap-y-3 pt-6 text-white">
              <div className="flex">
                <div className="w-32 text-gray">Market Price</div>
                <div>
                  $
                  {synthetic.price.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
              <div className="flex">
                <div className="w-32 text-gray">24h Change</div>
                <div
                  className={`${
                    synthetic?.change24h > 0
                      ? 'text-[#6FD572]'
                      : 'text-[#FE886D]'
                  }`}
                >
                  {synthetic.change24h.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  %
                </div>
              </div>
              <div className="flex">
                <div className="w-32 text-gray">24h Volume</div>
                <div>
                  $
                  {synthetic.volume.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>
            <div className="gap-y-3 pt-6 text-white">
              <div className="flex ">
                <div className="w-28 text-gray  ">Your Balance</div>
                <div className="">$0.00</div>
              </div>
            </div>
          </div>
          <div className="mb-4 mt-8 w-full border-b-[0.5px] border-[#c9c9cb2e]"></div>
          <div className="flex justify-between">
            <div className="h-[400px] w-[70%]">
              <TradingViewChart />
            </div>
            <div className="relative w-[25%] ">
              <div className="relative grid h-fit gap-y-2">
                <div className="flex justify-between rounded-md bg-[#3a4155] px-5 py-3 text-white">
                  <div>
                    <div className="flex items-center gap-x-2">
                      <div>$</div>
                      <div>USD</div>
                    </div>
                    <div>Balance: $0.00</div>
                  </div>
                  <div className="w-fit">
                    <input
                      type={'text'}
                      id="workspaceName"
                      name="workspaceName"
                      value={usdAmount}
                      onChange={(e) => {
                        handleValues('usd', e.target.value)
                      }}
                      className="w-fit rounded-md bg-transparent text-right text-base text-body-color placeholder-body-color shadow-one outline-none"
                    />{' '}
                  </div>
                </div>{' '}
                <img
                  alt="switch"
                  src="/images/synthetics/arrow-down.svg"
                  className={`absolute left-[45%] top-[40%] w-7 cursor-pointer rounded-full bg-blue p-1 transition-transform ${
                    isRotated ? 'rotate-180' : 'rotate-0'
                  }`}
                  onClick={() => {
                    setIsRotated(!isRotated)
                  }}
                ></img>
                <div className="flex justify-between rounded-md bg-[#3a4155] px-5 py-3 text-white">
                  <div>
                    <div className="flex items-center gap-x-2">
                      <img
                        alt="delete"
                        src={assetToStyle[synthetic?.name]?.imgSource}
                        className={assetToStyle[synthetic?.name]?.imgStyle}
                      ></img>
                      <div>{synthetic?.ticker}</div>
                    </div>
                    <div>Balance: $0.00</div>
                  </div>
                  <div className="w-fit">
                    <input
                      type={'text'}
                      id="workspaceName"
                      name="workspaceName"
                      value={() => {
                        const index = fundAmount.findIndex(
                          (nw) => nw.currency === synthetic?.name,
                        )
                        return fundAmount[index].value
                      }}
                      onChange={(e) => {
                        handleValues(synthetic?.name, e.target.value)
                      }}
                      className="w-fit rounded-md bg-transparent text-right text-base text-body-color placeholder-body-color shadow-one outline-none"
                    />{' '}
                  </div>
                </div>
              </div>

              <label className="mt-4 flex w-full justify-center rounded-md border-[1px] border-[#3a4155] bg-transparent py-2 text-lg text-gray/65">
                {isRotated ? 'Sell' : 'Buy'} {synthetic?.ticker}
              </label>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default MainPage
