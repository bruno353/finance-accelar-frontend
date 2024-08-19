'use client'

import type { Abi, Chain, Account } from 'viem'
import { useReadContract, useWriteContract } from 'wagmi'
import type {
  Config,
  UseReadContractParameters,
  UseWriteContractParameters,
} from 'wagmi'
import { wagmiConfig } from '@/blockchain/config'
import { waitForTransactionReceipt } from '@wagmi/core'
import { parseCookies, destroyCookie, setCookie } from 'nookies'
import { callAxiosBackend } from '@/utils/general-api'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export function useAcoUtils() {
  const checkAndSetAcoUserExists = async (address: string) => {
    const { acoUsers } = parseCookies()
    const parsedAcoUsers = acoUsers ? JSON.parse(acoUsers) : []

    console.log('parsedAcoUsers')
    console.log(parsedAcoUsers)

    if (parsedAcoUsers.includes(address)) {
      return true
    }

    try {
      const res = await callAxiosBackend(
        'get',
        `/blockchain/depin/functions/acoUserExistIC?address=${address}`,
        'userSessionToken',
      )
      console.log(res)

      if (res?.res === true) {
        // Verifica se o endereço já existe no array
        if (!parsedAcoUsers.includes(address)) {
          parsedAcoUsers.push(address)
          setCookie(null, 'acoUsers', JSON.stringify(parsedAcoUsers), {
            path: '/',
            maxAge: 180 * 24 * 60 * 60, // Exemplo de validade do cookie: 30 dias
            secure: true, // Recomendado para produção, garante que o cookie seja enviado apenas por HTTPS
            sameSite: 'strict', // Recomendado para evitar ataques de CSRF
          })
        }
        return true
      } else {
        return false
      }
    } catch (err) {
      console.log(err)
      toast.error(`Error: ${err}`)
      return false
    }
  }

  return { checkAndSetAcoUserExists }
}
