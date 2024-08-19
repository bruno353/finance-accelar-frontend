import { useSignMessage, useAccount } from 'wagmi'
import type { Account } from 'viem'
import { handleError } from './errors'
import { wagmiConfig } from '@/blockchain/config'

export function useSignContractMessage() {
  const { address } = useAccount()

  const { signMessageAsync, isError, isSuccess, error } = useSignMessage({
    config: wagmiConfig,
    mutation: {
      onError: (error) => {
        handleError(error)
      },
      onSettled: (data) => {
        console.log(data)
      },
    },
  })

  const signMessage = async (
    message: string,
    account: `0x${string}` | Account,
  ) => {
    if (!address) {
      throw new Error('User is not connected')
    }

    try {
      const signature = await signMessageAsync({
        message,
        account,
      })

      return signature
    } catch (error) {
      console.error('Error signing message:', error)
      throw error
    }
  }

  return { signMessage, isError, isSuccess, error }
}
