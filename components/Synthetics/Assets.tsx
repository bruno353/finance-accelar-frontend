export enum Protocols {
  'HORIZON_PROTOCOL' = 'HORIZON_PROTOCOL',
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
    imgSource: '/images/synthetics/google.png',
    imgStyle: 'w-[18px] 2xl:w-[20px]',
  },
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
]
