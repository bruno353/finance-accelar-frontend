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
import { AccountContext } from '../../contexts/AccountContext'
// import NewWorkspaceModal from './NewWorkspace'
import { getBlockchainApps, getUserWorkspace, getWorkspace } from '@/utils/api'
import { WorkspaceProps } from '@/types/workspace'
import SubNavBar from '../Modals/SubNavBar'
import { Logo } from '../Sidebar/Logo'
import { BlockchainWalletProps } from '@/types/blockchain-app'
import { getBlockchainWallets } from '@/utils/api-blockchain'
// import NewAppModal from './Modals/NewAppModal'
import Editor, { useMonaco } from '@monaco-editor/react'
import Dropdown, { ValueObject } from '../Modals/Dropdown'
import { depinOptionsFeatures, depinOptionsNetwork } from '@/types/consts/depin'
import { callAxiosBackend } from '@/utils/general-api'
import {
  DepinDeploymentProps,
  FakeDepinProps,
  LeasesProps,
  NewDepinDeploymentProps,
} from '@/types/depin'
import {
  blockHeightToDate,
  formatDate,
  transformString,
  wait,
} from '@/utils/functions'
import LottiePlayer from 'react-lottie-player'
import { useAccount } from 'wagmi'
import { chainToCopy } from '@/blockchain/utils/chainToMetaData'
import {
  AssetTypes,
  Protocols,
  SynAsset,
  assetToStyle,
  clearpoolMetadata,
  landrxMetadata,
  poolToStyle,
  syntethicAssets,
} from './Assets'
import { Sparklines, SparklinesLine } from 'react-sparklines'

const getLatestPrice = async (sticker: string, from: number, to: number) => {
  const url = `https://benchmarks.pyth.network/v1/shims/tradingview/history?symbol=${sticker}&resolution=60&from=${from}&to=${to}`

  const response = await fetch(url)
  const data = await response.json()
  return data
}

export async function getDataHP(stickerPricing: string) {
  const currentTimestamp = Math.floor(Date.now() / 1000)
  const threeDaysAgo = currentTimestamp - 72 * 60 * 60 // 72 hours ago
  const oneDayAgo = currentTimestamp - 24 * 60 * 60 // 24 hours ago

  const dataPricing = await getLatestPrice(
    stickerPricing,
    threeDaysAgo,
    currentTimestamp,
  )

  console.log('data pricing s')
  console.log(dataPricing)

  if (dataPricing.s === 'ok' && dataPricing.c && dataPricing.c.length > 0) {
    const latestPrice = dataPricing.c[dataPricing.c.length - 1]
    let price24HoursAgo = 0
    let priceChangePercent: any = 0

    const prices24h = dataPricing.c.filter(
      (price, index) => dataPricing.t[index] >= oneDayAgo && price > 0,
    )

    if (prices24h.length > 0) {
      price24HoursAgo = prices24h[0] // First price in the last 24 hours
      priceChangePercent = (
        ((latestPrice - price24HoursAgo) / price24HoursAgo) *
        100
      ).toFixed(2)
    }

    return {
      latestPrice,
      priceChangePercent: Number(priceChangePercent),
      priceArray24h: prices24h,
    }
  } else {
    console.log('Não foi possível obter os dados.')
    return { latestPrice: 0, priceChangePercent: 0, priceArray24h: [] }
  }
}

export const getVolume = async () => {
  const currentTimestamp = Math.floor(Date.now() / 1000) // Timestamp atual
  const oneDayAgo = currentTimestamp - 24 * 60 * 60 // 24 horas atrás

  const data = {
    query:
      '\n                    query ($timestamp24H: BigInt!) {\n                        \n        zassetTradingVolumes(\n            first: 1\n            where: {\n                currencyKey: "zUSD"\n                timestamp_gte: $timestamp24H,\n                period: 86400\n            }\n            orderBy: timestamp\n            orderDirection: desc\n        ) {\n            finalAmount\n        }\n    \n                    }\n                ',
    variables: {
      timestamp24H: oneDayAgo,
    },
  }
  const config = {
    method: 'post',
    url: `https://api.studio.thegraph.com/query/76663/mainnet-exchanges/v0.0.1`,
    headers: {
      'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
      'Content-Type': 'application/json',
    },
    data,
  }

  let dado

  await axios(config).then(function (response) {
    if (response.data) {
      dado = response.data
      console.log(dado)
    }
  })
  return dado
}

const MainPage = ({ id }) => {
  const [isLoading, setIsLoading] = useState(true)
  const monaco = useMonaco()
  const [depins, setDepins] = useState<NewDepinDeploymentProps[]>([])
  const [synthetics, setSynthetics] = useState<SynAsset[]>([])

  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    Object.values(AssetTypes),
  )
  // Função para alternar a seleção de tipos de ativos
  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type))
    } else {
      setSelectedTypes([...selectedTypes, type])
    }
  }
  const { address, chain } = useAccount()
  const { acoUser, acoChain } = useContext(AccountContext)

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

  const onMount = (editor) => {
    editorRef.current = editor
    editor.focus()
  }
  const menuRef = useRef(null)

  function formatDate(createdAt) {
    const date = new Date(createdAt)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const formattedDate = date.toISOString().split('T')[0]

    return `${hours}:${minutes}, ${formattedDate}`
  }

  async function getDataLandx(data: SynAsset) {
    const dataPricing = await getLatestPriceLandx(data.stickerPricing)

    if (dataPricing?.data?.length > 0) {
      const values = dataPricing?.data?.map((obj) => Object.values(obj)[0])

      const latestPrice = Number(values[dataPricing?.data?.length - 1])
      const price24HoursAgo = dataPricing?.data[dataPricing?.data?.length - 2]

      // Calculando a variação percentual
      const priceChangePercent = (
        ((latestPrice - price24HoursAgo) / price24HoursAgo) *
        100
      ).toFixed(2)
      console.log('price change')
      console.log(priceChangePercent)
      console.log(latestPrice)
      const priceArray24hTreated = values

      return {
        latestPrice,
        priceChangePercent,
        priceArray24h: priceArray24hTreated,
      }
    } else {
      console.log('Não foi possível obter os dados.')
    }
  }

  async function getData() {
    setIsLoading(true)
    try {
      const newAssets = [...syntethicAssets]
      if (syntethicAssets?.length > 0) {
        console.log('entrei aqui sim')
        const volumeHorizonProtocol = await getVolume()
        for (let i = 0; i < syntethicAssets?.length; i++) {
          if (syntethicAssets[i].pool === Protocols.HORIZON_PROTOCOL) {
            console.log('getting data for horizon protocol')
            const res = await getDataHP(newAssets[i].stickerPricing)
            newAssets[i].price = res?.latestPrice
            newAssets[i].change24h = Number(res?.priceChangePercent)
            newAssets[i].priceArray24h = res?.priceArray24h
            newAssets[i].volume =
              Number(
                (
                  Number(
                    volumeHorizonProtocol?.data?.zassetTradingVolumes[0]
                      ?.finalAmount,
                  ) /
                  10 ** 18
                ).toFixed(2),
              ) || 0
            console.log('dados da pool ' + newAssets[i]?.name)
            console.log(newAssets[i])
          } else if (syntethicAssets[i].pool === Protocols.LANDX) {
            console.log('getting data no landx')
            const res = landrxMetadata[syntethicAssets[i].name]
            newAssets[i].price = res?.price
            newAssets[i].volume = res?.poolSize
            newAssets[i].apr = res?.apr
          } else if (syntethicAssets[i].pool === Protocols.CLEARPOOL) {
            console.log('getting data no landx')
            const res = clearpoolMetadata[syntethicAssets[i].name]
            newAssets[i].price = res?.price
            newAssets[i].volume = res?.poolSize
            newAssets[i].apr = res?.apr
          }
        }
      }

      setSynthetics(newAssets)
    } catch (err) {
      console.log(err)
      toast.error(`Error: ${err.response}`)
    }
    setIsLoading(false)
  }

  const getLatestPriceLandx = async (sticker: string) => {
    const url = `https://api-mainnet.landx.fi/api/public/shards/price-chart?asset=${sticker}&period=1m`

    const response = await fetch(url)
    const data = await response.json()
    console.log('got price')
    return data
  }

  const getVolume = async () => {
    const currentTimestamp = Math.floor(Date.now() / 1000) // Timestamp atual
    const oneDayAgo = currentTimestamp - 24 * 60 * 60 // 24 horas atrás

    const data = {
      query:
        '\n                    query ($timestamp24H: BigInt!) {\n                        \n        zassetTradingVolumes(\n            first: 1\n            where: {\n                currencyKey: "zUSD"\n                timestamp_gte: $timestamp24H,\n                period: 86400\n            }\n            orderBy: timestamp\n            orderDirection: desc\n        ) {\n            finalAmount\n        }\n    \n                    }\n                ',
      variables: {
        timestamp24H: oneDayAgo,
      },
    }
    const config = {
      method: 'post',
      url: `https://api.studio.thegraph.com/query/76663/mainnet-exchanges/v0.0.1`,
      headers: {
        'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
        'Content-Type': 'application/json',
      },
      data,
    }

    let dado

    await axios(config).then(function (response) {
      if (response.data) {
        dado = response.data
        console.log(dado)
      }
    })
    return dado
  }

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    getData()
  }, [address])

  if (isLoading) {
    return (
      <div className="container grid w-full gap-y-[30px]  text-[16px] md:pb-20 lg:pb-28 lg:pt-40">
        <div className="h-20 w-full animate-pulse rounded-[5px] bg-[#1d1f23b6]"></div>
        <div className="h-40 w-full animate-pulse rounded-[5px] bg-[#1d1f23b6]"></div>
      </div>
    )
  }

  if (synthetics?.length === 0 && !isLoading) {
    return (
      <>
        <section className="relative z-10 h-full overflow-hidden  pb-5 pt-2 text-center lg:pt-40">
          <div className="mx-auto w-[300px]">
            <LottiePlayer
              loop
              animationData={require('./mo.json')}
              play
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
          <div className="text-2xl text-white 2xl:text-2xl">
            No synthetics found
          </div>
          <div
            onClick={() => {
              push('/feats/depin/builder')
            }}
            className={`${
              isLoading &&
              '!hover:bg-current animate-pulse !cursor-auto !bg-[#4765eaad]'
            } mx-auto mt-10 max-w-[200px] cursor-pointer rounded-md bg-[#4766EA] px-3 py-1 text-white hover:bg-[#3A51B0]`}
          >
            Soon
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <section className="relative z-10 h-full overflow-hidden  pb-5 pt-2 lg:pt-40">
        <div className="container px-12">
          <div className="flex items-center gap-x-3">
            <div className="w-[40px]">
              <LottiePlayer
                loop
                animationData={require('./orb.json')}
                play
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
            <div className="text-2xl text-white 2xl:text-2xl">
              {synthetics?.length} Assets
            </div>
          </div>
          <div className="mb-4 ml-auto mt-2 flex w-fit gap-x-4">
            {Object.values(AssetTypes).map((type) => (
              <div key={type} className="flex items-center gap-x-2">
                <div
                  className={`h-3 w-3 rounded-sm ${
                    selectedTypes.includes(type) ? 'bg-hoverBlue' : ''
                  } cursor-pointer border-[1px] border-hoverBlue`}
                  onClick={() => toggleType(type)}
                ></div>
                <label className="text-gray">
                  {type
                    ? type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
                    : ''}
                </label>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <div className="flex w-full border-y-[0.5px] border-[#c9c9cb10] px-[15px] py-4 text-xs text-gray">
              <div className="w-full max-w-[20%]">Asset</div>
              <div className="w-full max-w-[15%]">Price</div>
              <div className="w-full max-w-[25%]">Volume</div>
              <div className="w-full max-w-[20%]">Info</div>
              <div className="w-full max-w-[10%]">Pool</div>
              <div className="w-full max-w-[10%]">Type</div>
            </div>
          </div>
          {synthetics
            ?.filter((syn) => selectedTypes.includes(syn?.type)) // Filtra apenas os tipos selecionados
            .map((syn, index) => (
              <div key={index} className="">
                <div
                  onClick={(event) => {
                    if (syn.pool === Protocols.HORIZON_PROTOCOL) {
                      push(`/feats/synthetics/stocks/${syn?.ticker}`)
                    }
                  }}
                  key={index}
                  className={`flex items-center  ${
                    index !== depins?.length - 1 &&
                    'border-b-[1px] border-[#c5c4c41a]'
                  } cursor-pointer gap-x-[2px] px-[15px] py-[20px] text-[15px] font-normal text-gray hover:bg-[#7775840c]`}
                >
                  <div className="w-full max-w-[20%] overflow-hidden truncate text-ellipsis whitespace-nowrap text-white">
                    <div className="flex items-center gap-x-4">
                      <img
                        alt="delete"
                        src={assetToStyle[syn?.name]?.imgSource}
                        className={assetToStyle[syn?.name]?.imgStyle}
                      ></img>
                      <div>{syn?.name}</div>
                    </div>
                  </div>
                  <div className="w-full max-w-[15%] overflow-hidden truncate text-ellipsis whitespace-nowrap text-white">
                    $ {syn?.price ? syn?.price?.toFixed(2) : 0}
                  </div>
                  <div className="w-full max-w-[25%] overflow-hidden truncate text-ellipsis whitespace-nowrap text-white">
                    <div className="flex items-center gap-x-2">
                      {syn?.pool === Protocols.HORIZON_PROTOCOL ? (
                        <div className="text-xs text-gray">Volume 24h</div>
                      ) : (
                        <div className="text-xs text-gray">Pool size</div>
                      )}
                      <img
                        alt="delete"
                        src="/images/synthetics/usd.png"
                        className="w-[18px]"
                      ></img>
                      <div>
                        {syn?.volume
                          ? syn.volume.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : '0.00'}
                      </div>{' '}
                    </div>
                  </div>
                  <div className="w-full max-w-[20%] overflow-hidden truncate text-ellipsis whitespace-nowrap">
                    {syn?.pool === Protocols.HORIZON_PROTOCOL ? (
                      <div className="">
                        {' '}
                        {syn?.change24h ? (
                          <div className="flex items-center gap-x-4">
                            <div className="text-xs text-gray">Change 24h:</div>
                            {Math.abs(syn?.change24h) < 0.9 ? (
                              <div className="text-white">0%</div>
                            ) : (
                              <div className="flex items-center gap-x-4">
                                <div className="w-12">
                                  <Sparklines
                                    data={syn?.priceArray24h}
                                    width={100}
                                    height={40}
                                  >
                                    <SparklinesLine
                                      style={{
                                        strokeWidth: 3,
                                        stroke:
                                          syn?.change24h > 0
                                            ? '#6FD572'
                                            : '#FE886D',
                                        fill: 'none',
                                      }}
                                    />
                                  </Sparklines>
                                </div>

                                <div className="flex items-center gap-x-2">
                                  <div
                                    className={`text-sm ${
                                      syn?.change24h > 0
                                        ? 'text-[#6FD572]'
                                        : 'text-[#FE886D]'
                                    }`}
                                  >
                                    {syn?.change24h.toFixed(0)}%
                                  </div>
                                  <div
                                    className={`${
                                      syn?.change24h > 0
                                        ? 'rotate-45  font-bold text-[#6FD572]'
                                        : '-rotate-45 font-bold text-[#FE886D]'
                                    }`}
                                  >
                                    {syn?.change24h > 0 ? '↑' : '↓'}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>0%</div>
                        )}
                      </div>
                    ) : (
                      <div className="text-white">
                        <span className="mr-1 text-xs text-gray">APR:</span>{' '}
                        {syn?.apr}%
                      </div>
                    )}
                  </div>
                  <div className="-ml-2 w-full max-w-[10%]">
                    <img
                      alt="delete"
                      src={poolToStyle[syn?.pool].imgSource}
                      className={poolToStyle[syn?.pool].imgStyle}
                    ></img>
                  </div>
                  <div className="w-full max-w-[10%]">
                    <div>
                      {syn?.type
                        ? syn.type.charAt(0).toUpperCase() +
                          syn.type.slice(1).toLowerCase()
                        : ''}
                    </div>{' '}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>
    </>
  )
}

export default MainPage
