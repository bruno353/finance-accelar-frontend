export enum Protocols {
  'HORIZON_PROTOCOL' = 'HORIZON_PROTOCOL',
  'LANDX' = 'LANDX',
}

export const assetToStyle = {
  Tesla: {
    imgSource: '/images/synthetics/tesla-logo.svg',
    imgStyle: 'w-[18px] 2xl:w-[20px]',
  },
  Google: {
    imgSource: '/images/synthetics/google.png',
    imgStyle: 'w-[18px] 2xl:w-[20px]',
  },
  Nvidia: {
    imgSource: '/images/synthetics/nvidia.png',
    imgStyle: 'w-[18px] 2xl:w-[22px]',
  },
  Gold: {
    imgSource: '/images/synthetics/gold.png',
    imgStyle: 'w-[18px] 2xl:w-[22px]',
  },
  Yen: {
    imgSource: '/images/synthetics/yen.svg',
    imgStyle: 'w-[14px] 2xl:w-[16px] ml-1',
  },
  xSoy: {
    imgSource: '/images/synthetics/soy.svg',
    imgStyle: 'w-[18px] 2xl:w-[22px]',
  },
}

const nameToPrice = {
  xSoy: 509600,
}

export interface SynAsset {
  name: string
  ticker: string
  pool: Protocols
  price?: number
  volume?: number
  change24h?: number
  priceArray24h?: number[]
  stickerPricing?: string
}

export const syntethicAssets: SynAsset[] = [
  {
    name: 'Tesla',
    ticker: 'zTSLA',
    pool: Protocols.HORIZON_PROTOCOL,
    stickerPricing: 'Equity.US.TSLA/USD',
  },
  {
    name: 'Google',
    ticker: 'zGOOGL',
    pool: Protocols.HORIZON_PROTOCOL,
    stickerPricing: 'Equity.US.GOOG/USD',
  },
  {
    name: 'Nvidia',
    ticker: 'zNVDA',
    pool: Protocols.HORIZON_PROTOCOL,
    stickerPricing: 'Equity.US.NVDA/USD',
  },
  {
    name: 'Gold',
    ticker: 'zXAU',
    pool: Protocols.HORIZON_PROTOCOL,
    stickerPricing: 'Metal.XAU/USD',
  },
  {
    name: 'Yen',
    ticker: 'zJPY',
    pool: Protocols.HORIZON_PROTOCOL,
    stickerPricing: 'FX.USD/JPY',
  },
  {
    name: 'xSoy',
    ticker: 'xSoy',
    pool: Protocols.LANDX,
    stickerPricing: 'xSOY',
  },
]
