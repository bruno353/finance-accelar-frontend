import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { cookieStorage, createStorage, http } from 'wagmi'
import { mainnet, bscTestnet, sepolia, holesky } from 'wagmi/chains'

export const projectId = 'a8a94eaa29bf7b1d3a0d94172c58e6ac'

const crossfiTestnet = {
  id: 4157,
  name: 'CrossFi Testnet',
  network: 'crossfi',
  nativeCurrency: {
    name: 'XFI',
    symbol: 'XFI',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.ms'],
    },
    public: {
      http: ['https://rpc.testnet.ms'],
    },
  },
  blockExplorers: {
    default: { name: 'CrossfiScan', url: 'https://scan.testnet.ms' },
  },
  testnet: true,
}

const fraxtalMainnet = {
  id: 252,
  name: 'Fraxtal',
  network: 'fraxtal',
  nativeCurrency: {
    name: 'frxETH',
    symbol: 'frxETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.frax.com'],
    },
    public: {
      http: ['https://rpc.frax.com'],
    },
  },
  blockExplorers: {
    default: { name: 'FraxScan', url: 'https://fraxscan.com' },
  },
  testnet: false,
}

const coreDaoBTC = {
  id: 1115,
  name: 'Core DAO',
  network: 'Core Blockchain Testnet',
  nativeCurrency: {
    name: 'tCORE',
    symbol: 'tCORE',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.test.btcs.network'],
    },
    public: {
      http: ['https://rpc.test.btcs.network'],
    },
  },
  blockExplorers: {
    default: { name: 'CoreScan', url: 'https://scan.coredao.org' },
  },
  testnet: true,
}

const opSepolia = {
  id: 11155420,
  name: 'OP Sepolia',
  network: 'sepolia',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia.optimism.io'],
    },
    public: {
      http: ['https://sepolia.optimism.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'SepoliaScan',
      url: 'https://optimism-sepolia.blockscout.com',
    },
  },
  testnet: false,
}

if (!projectId) throw new Error('Project ID is not defined')

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
}

export const wagmiConfig = defaultWagmiConfig({
  chains: [coreDaoBTC, opSepolia], // required
  projectId, // required
  metadata, // required
  ssr: true,
  transports: {
    [coreDaoBTC.id]: http('https://rpc.test.btcs.network'),
    [fraxtalMainnet.id]: http('https://rpc.frax.com'),
    [crossfiTestnet.id]: http('https://rpc.testnet.ms'),
    [opSepolia.id]: http('https://sepolia.optimism.io'),
    [holesky.id]: http('https://endpoints.omniatech.io/v1/eth/holesky/public'),
  },
  storage: createStorage({
    storage: cookieStorage,
  }),
  enableWalletConnect: true, // Optional - true by default
  enableInjected: true, // Optional - true by default
  enableEIP6963: true, // Optional - true by default
  enableCoinbase: true, // Optional - true by default
})
