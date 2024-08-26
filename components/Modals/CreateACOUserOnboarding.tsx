/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/no-unknown-property */
/* eslint-disable dot-notation */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
'use client'
// import { useState } from 'react'
import { useEffect, useState, ChangeEvent, FC, useContext, useRef } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'react-quill/dist/quill.snow.css' // import styles
import 'react-datepicker/dist/react-datepicker.css'
import { parseCookies, destroyCookie, setCookie } from 'nookies'
import {
  createAutomationWorkflow,
  editAutomationWorkflow,
} from '@/utils/api-automation'
import Dropdown, { ValueObject } from '@/components/Modals/Dropdown'
import { wait } from '@/utils/functions'
import { callAxiosBackend } from '@/utils/general-api'
import { AccountContext } from '@/contexts/AccountContext'
import LottiePlayer from 'react-lottie-player'
import { useSignMessage, useAccount, useReadContract } from 'wagmi'
import type { Account } from 'viem'
import { wagmiConfig } from '@/blockchain/config'
import { chainToCopy } from '@/blockchain/utils/chainToMetaData'

export const optionsNetworkDeployment = [
  {
    name: 'Internet computer protocol',
    value: 'ICP',
    token: 'ICP',
    imageSrc: '/images/workspace/icp.png',
    imageStyle: 'w-[25px]',
  },
]

const CreateACOUserOnboarding = ({ onUpdateM }) => {
  const [appName, setAppName] = useState('')
  const [sdlValue, setSDLValue] = useState('')
  const [userExist, setUserExist] = useState(false)
  const [isLoading, setIsLoading] = useState(null)
  const [selected, setSelected] = useState<ValueObject>(
    optionsNetworkDeployment[0],
  )
  const { address, chain } = useAccount()
  const { acoUser, setAcoUser, acoChain } = useContext(AccountContext)

  const { signMessageAsync, isError, isSuccess, error } = useSignMessage({
    config: wagmiConfig,
    mutation: {
      onError: (error) => {
        setIsLoading(false)
        console.log(error)
      },
      onSettled: (data) => {
        console.log(data)
      },
    },
  })

  const handleCreateAcoUser = async () => {
    setIsLoading(true)
    const signedMessage = await signMessageAsync({
      message: 'create-akash-address',
      account: address,
    })
    console.log('signedMessage recibido')
    console.log(signedMessage)

    const data = {
      signature: signedMessage,
    }

    try {
      const res = await callAxiosBackend(
        'post',
        `/blockchain/depin/functions/createAcoUser`,
        'userSessionToken',
        data,
      )

      // setting aco user
      const { acoUsers } = parseCookies()
      const parsedAcoUsers = acoUsers ? JSON.parse(acoUsers) : []
      if (!parsedAcoUsers.includes(address)) {
        parsedAcoUsers.push(address)
        setCookie(null, 'acoUsers', JSON.stringify(parsedAcoUsers), {
          path: '/',
          maxAge: 180 * 24 * 60 * 60, // Exemplo de validade do cookie: 30 dias
          secure: true, // Recomendado para produção, garante que o cookie seja enviado apenas por HTTPS
          sameSite: 'strict', // Recomendado para evitar ataques de CSRF
        })
      }
      setAcoUser({ address })
    } catch (err) {
      console.log(err)
    }
    setIsLoading(false)
  }
  const modalRef = useRef<HTMLDivElement>(null)

  return (
    <div className={`flex items-center justify-center font-normal`}>
      <div className=" w-[500px] rounded-md bg-transparent p-8 py-12 text-center text-base text-white">
        <div className="mx-auto w-[200px] min-w-[30px]">
          <LottiePlayer
            loop
            animationData={require('@/public/animations/network-gray.json')}
            play
            style={{ width: '100%', height: 'auto', color: '#fff' }}
          />
        </div>
        <div className="mt-5 text-2xl font-bold">
          Create your Accelar Account in the{' '}
          <span className="text-yellow">{chainToCopy[acoChain]?.name}</span>{' '}
          protocol
        </div>
        <div className="mt-2 text-gray">
          You will be asked to sign the creation message
        </div>
        <div
          onClick={() => {
            if (!isLoading) {
              handleCreateAcoUser()
            }
          }}
          className={`${
            isLoading &&
            '!hover:bg-current animate-pulse !cursor-auto !bg-[#4765eaad]'
          } mx-auto mt-10 max-w-[300px] cursor-pointer rounded-md bg-[#4766EA] px-5 py-1 text-white hover:bg-[#3A51B0]`}
        >
          Create account
        </div>
      </div>
    </div>
  )
}

export default CreateACOUserOnboarding
