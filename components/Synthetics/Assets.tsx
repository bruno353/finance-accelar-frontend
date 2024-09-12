export enum Protocols {
  'HORIZON_PROTOCOL' = 'HORIZON_PROTOCOL',
  'LANDX' = 'LANDX',
  'CLEARPOOL' = 'CLEARPOOL',
}

export enum AssetTypes {
  'FIAT' = 'FIAT',
  'COMMODITY' = 'COMMODITY',
  'STOCK' = 'STOCK',
  'LENDING' = 'LENDING',
}

export const assetToStyle = {
  Tesla: {
    imgSource: '/images/synthetics/tesla-logo.svg',
    imgStyle: 'w-[18px] 2xl:w-[20px]',
    imgStyleBig: 'w-[18px] 2xl:w-[30px]',
  },
  Google: {
    imgSource: '/images/synthetics/google.png',
    imgStyle: 'w-[18px] 2xl:w-[20px]',
    imgStyleBig: 'w-[18px] 2xl:w-[30px]',
  },
  Nvidia: {
    imgSource: '/images/synthetics/nvidia.png',
    imgStyle: 'w-[18px] 2xl:w-[22px]',
    imgStyleBig: 'w-[18px] 2xl:w-[30px]',
  },
  Gold: {
    imgSource: '/images/synthetics/gold.png',
    imgStyle: 'w-[18px] 2xl:w-[22px]',
    imgStyleBig: 'w-[18px] 2xl:w-[30px]',
  },
  Yen: {
    imgSource: '/images/synthetics/yen.svg',
    imgStyle: 'w-[14px] 2xl:w-[16px] ml-1',
    imgStyleBig: 'w-[18px] 2xl:w-[30px]',
  },
  xSoy: {
    imgSource: '/images/synthetics/soy.svg',
    imgStyle: 'w-[18px] 2xl:w-[22px]',
    imgStyleBig: 'w-[18px] 2xl:w-[30px]',
  },
  xRice: {
    imgSource: '/images/synthetics/rice.svg',
    imgStyle: 'w-[18px] 2xl:w-[22px]',
    imgStyleBig: 'w-[18px] 2xl:w-[30px]',
  },
  Bastion: {
    imgSource: '/images/synthetics/bastion_trading.svg',
    imgStyle: 'w-[18px] 2xl:w-[22px]',
    imgStyleBig: 'w-[18px] 2xl:w-[30px]',
  },
}

export const poolToStyle = {
  HORIZON_PROTOCOL: {
    imgSource: '/images/synthetics/horizon-protocol.png',
    imgStyle: 'w-[25px]',
  },
  LANDX: {
    imgSource: '/images/synthetics/lndx.webp',
    imgStyle: 'w-[25px]',
  },
  CLEARPOOL: {
    imgSource: '/images/synthetics/clearpool.svg',
    imgStyle: 'w-[25px]',
  },
}

export const clearpoolMetadata = {
  Bastion: {
    price: 1,
    apr: 6.66,
    poolSize: 1859325.69,
  },
}

export const landrxMetadata = {
  xRice: {
    price: 2.81,
    apr: 17.9,
    poolSize: 497900,
  },
  xSoy: {
    price: 5.84,
    apr: 16.3,
    poolSize: 509600,
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
  apr?: string
  type?: AssetTypes
  live?: boolean
}

export interface SynAssetHistoryTx {
  currency: string
  counterCurrency: string
  type: string
  amountCurrency?: string
  amountCounterCurrency?: string
  evmHash?: string
  protocolHash?: string
  blockHeight?: string
  loading?: boolean
  evmAddress?: string
  chain?: string
  createdAt?: string
  updatedAt?: string
}

export const syntethicAssets: SynAsset[] = [
  {
    name: 'Tesla',
    ticker: 'zTSLA',
    pool: Protocols.HORIZON_PROTOCOL,
    stickerPricing: 'Equity.US.TSLA/USD',
    type: AssetTypes.STOCK,
    live: true,
  },
  {
    name: 'Bastion',
    ticker: 'bastion',
    pool: Protocols.CLEARPOOL,
    stickerPricing: 'bastion',
    type: AssetTypes.LENDING,
  },
  {
    name: 'Google',
    ticker: 'zGOOGL',
    pool: Protocols.HORIZON_PROTOCOL,
    stickerPricing: 'Equity.US.GOOG/USD',
    type: AssetTypes.STOCK,
    live: true,
  },
  {
    name: 'xSoy',
    ticker: 'xSoy',
    pool: Protocols.LANDX,
    stickerPricing: 'xSOY',
    type: AssetTypes.COMMODITY,
  },
  {
    name: 'xRice',
    ticker: 'xRice',
    pool: Protocols.LANDX,
    stickerPricing: 'xRICE',
    type: AssetTypes.COMMODITY,
  },
  {
    name: 'Nvidia',
    ticker: 'zNVDA',
    pool: Protocols.HORIZON_PROTOCOL,
    stickerPricing: 'Equity.US.NVDA/USD',
    type: AssetTypes.STOCK,
    live: true,
  },
  {
    name: 'Gold',
    ticker: 'zXAU',
    pool: Protocols.HORIZON_PROTOCOL,
    stickerPricing: 'Metal.XAU/USD',
    type: AssetTypes.COMMODITY,
  },
  {
    name: 'Yen',
    ticker: 'zJPY',
    pool: Protocols.HORIZON_PROTOCOL,
    stickerPricing: 'FX.USD/JPY',
    type: AssetTypes.FIAT,
    live: true,
  },
]
