/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/no-unknown-property */
/* eslint-disable dot-notation */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
'use client'
// import { useState } from 'react'
import {
  useEffect,
  useState,
  ChangeEvent,
  FC,
  useContext,
  useRef,
  useCallback,
} from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'react-quill/dist/quill.snow.css' // import styles
import 'react-datepicker/dist/react-datepicker.css'
import { parseCookies } from 'nookies'
import Dropdown, { ValueObject } from '@/components/Modals/Dropdown'
import { fundICPWallet, transferICP } from '@/utils/api-blockchain'
import { ICPWalletsProps, BlockchainWalletProps } from '@/types/blockchain-app'
import { formatTokenPrice, wait } from '@/utils/functions'
import { callAxiosBackend } from '@/utils/general-api'
import axios from 'axios'
import WebsocketComponent from '@/components/Chat/Websocket/WebsocketChat'
import {
  netEnvironmentToConfigs,
  netEnvironmentToLabel,
} from '@/types/consts/on-ramp'
import ConfirmGenericTransaction from '@/components/BlockchainWallets/Modals/ConfirmGenericTransaction'

export interface ModalI {
  address: string
  amountToReceive: string
  amountToPay: string
  token: string
  onUpdateM(): void
  onClose(): void
  isOpen: boolean
}

export enum OnRampStatus {
  ORDER_CREATION,
  PIX_RENDER,
}

export interface PixDataI {
  brCode: string
  qrCodeImage: string
  valueToReceive: string
  id: string
}

const OnRampModalSyn = ({
  address,
  amountToPay,
  amountToReceive,
  token,
  onUpdateM,
  onClose,
  isOpen,
}: ModalI) => {
  const [addressTo, setAddressTo] = useState('')
  const [onRampStatus, setOnRampStatus] = useState<OnRampStatus>(
    OnRampStatus.ORDER_CREATION,
  )
  const [pixData, setPixData] = useState<PixDataI | null>()

  const [isLoading, setIsLoading] = useState(false)
  const [isInfoOpen, setIsInfoOpen] = useState(false)

  const [isConfirmTransactionOpen, setIsConfirmTransactionOpen] =
    useState<any>(false)
  const confirmTransactionRef = useRef(null)

  const handleInputAddressChange = (e) => {
    setIsConfirmTransactionOpen(false)
    if (!isLoading) {
      const value = e.target.value
      setAddressTo(value)
    }
  }

  const handleCreateOrderPix = async () => {
    setIsLoading(true)

    const { userSessionToken } = parseCookies()

    const data = {
      value: Number(amountToPay),
      walletAddress: address,
    }

    try {
      const res = await callAxiosBackend(
        'post',
        '/blockchain/on-ramp/functions/createOrderPixSyn',
        userSessionToken,
        data,
      )
      toast.success(`Order created`)
      setOnRampStatus(OnRampStatus.PIX_RENDER)
      setPixData(res)
      //   startCheckOrder(res.id)
      setIsLoading(false)
      //   setTimeout(() => {
      //     onUpdateM()
      //   }, 30000)
    } catch (err) {
      console.log(err)
      toast.error(`Error: ${err.response.data.message}`)
      setIsLoading(false)
    }
  }

  const modalRef = useRef<HTMLDivElement>(null)

  const handleOverlayClick = (event) => {
    if (event.target === modalRef.current) {
      onClose()
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        confirmTransactionRef.current &&
        !confirmTransactionRef.current.contains(event.target)
      ) {
        setIsConfirmTransactionOpen(false)
      }
    }

    if (isConfirmTransactionOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isConfirmTransactionOpen])

  useEffect(() => {
    setAddressTo(address)
  }, [isOpen])

  //   async function startCheckOrder(id: string) {
  //     let counter = 0
  //     let intervalId
  //     if (
  //       isOpen &&
  //       onRampStatus === OnRampStatus.ORDER_CREATION &&
  //       counter < 300
  //     ) {
  //       intervalId = setInterval(() => {
  //         counter += 1
  //         checkOrder(id)
  //       }, 30000)
  //     }
  //     return () => clearInterval(intervalId)
  //   }

  if (onRampStatus === OnRampStatus.ORDER_CREATION) {
    return (
      <div
        onClick={handleOverlayClick}
        className={`fixed  inset-0 z-50 flex items-center justify-center font-normal backdrop-blur-sm ${
          isOpen ? 'visible opacity-100' : 'invisible opacity-0'
        } text-white transition-opacity duration-300`}
      >
        <div
          ref={modalRef}
          className="absolute inset-0 bg-[#1c1c3d] opacity-80"
        ></div>
        <div className="relative z-50 w-[250px] rounded-md bg-[#060621] p-8 py-12 pb-10 pt-6 md:w-[500px]">
          <div onClick={onClose} className="absolute right-5 top-5">
            <img
              alt="delete"
              src="/images/delete.svg "
              className="w-[25px]  cursor-pointer rounded-[7px] p-[5px] hover:bg-[#c9c9c921]"
            ></img>
          </div>
          <div className="mb-8 flex gap-x-2">
            <div className="flex items-center gap-x-3">
              <img
                alt="crossfi"
                src="/images/workspace/crossfi.png"
                className="w-[20px]"
              ></img>
              <div className="text-[20px]">On-ramp Crossfi</div>
            </div>
            <img
              alt="ethereum avatar"
              src="/images/header/help.svg"
              className="mb-2 w-[15px] cursor-pointer rounded-full"
              onMouseEnter={() => setIsInfoOpen(true)}
              onMouseLeave={() => setIsInfoOpen(false)}
            ></img>
            {isInfoOpen && (
              <div className="absolute right-0 flex w-fit max-w-[400px] -translate-y-[110%] translate-x-[20%] items-center rounded-[6px]   border-[1px]   border-[#cfcfcf81] bg-[#060621]  px-[10px]  py-[7px] text-center text-[12px]">
                For Brazilian citizens, you can now enter the Crossfi world
                buying synthetics directly through Pix payments. After sending
                the Pix order, the tokens will be transferred to your wallet
                immediately.
              </div>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="workspaceName"
              className="mb-2 block text-[14px] text-[#C5C4C4]"
            >
              Address to receive the synthetics
            </label>
            <input
              type="text"
              maxLength={500}
              id="workspaceName"
              name="workspaceName"
              placeholder="0x..."
              onChange={handleInputAddressChange}
              value={addressTo}
              className="w-full rounded-md border border-transparent px-6 py-2 text-base text-body-color placeholder-body-color  outline-none focus:border-primary  dark:bg-[#242B51]"
            />
          </div>
          <div className="mb-6">
            <div className="flex items-center justify-between gap-x-[5px]">
              <label
                htmlFor="workspaceName"
                className="mb-2 block text-[14px] text-[#C5C4C4]"
              >
                Amount (BRL) to fund - Method: Pix Brazil
              </label>
            </div>

            <input
              type="text"
              id="workspaceName"
              name="workspaceName"
              value={amountToPay}
              className="w-full rounded-md border border-transparent px-6 py-2 text-base text-body-color placeholder-body-color  outline-none focus:border-primary  dark:bg-[#242B51]"
            />
          </div>
          <div className="mb-6 flex gap-x-2">
            <div className="">XFI/BRL price:</div>
            <div>~ R$ 5.6</div>
          </div>
          <div className="mb-6 flex gap-x-2">
            <div className="">You will receive:</div>

            <div>
              ~ {amountToReceive} {token}
            </div>
          </div>
          <div className="relative mt-10 flex justify-between">
            <div
              className={`
                ${
                  Number(amountToPay) > 0 && addressTo?.length > 0
                    ? `${
                        isLoading
                          ? 'animate-pulse !bg-[#35428a]'
                          : '!cursor-pointer  !bg-[#273687] hover:bg-[#35428a] '
                      } `
                    : `!cursor-auto !bg-[#4f5b9bbb]`
                } rounded-[5px] p-[4px] px-[15px] text-[14px] text-[#fff]
                 `}
              onClick={() => {
                if (Number(amountToPay) > 100) {
                  toast.error(`Fund amount cannot be greater than R$100.00`)
                  return
                }
                if (
                  !isLoading &&
                  amountToPay &&
                  Number(amountToPay) > 0 &&
                  addressTo?.length > 0
                ) {
                  setIsConfirmTransactionOpen(true)
                }
              }}
            >
              Create Pix order
            </div>
            {isConfirmTransactionOpen && (
              <div
                ref={confirmTransactionRef}
                className="absolute right-0 w-fit -translate-x-[5%]"
              >
                <ConfirmGenericTransaction
                  description="You are going to create a pix order request"
                  onConfirmTransaction={() => {
                    setIsConfirmTransactionOpen(false)
                    handleCreateOrderPix()
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  } else if (onRampStatus === OnRampStatus.PIX_RENDER) {
    return (
      <div
        onClick={handleOverlayClick}
        className={`fixed  inset-0 z-50 flex items-center justify-center font-normal backdrop-blur-sm ${
          isOpen ? 'visible opacity-100' : 'invisible opacity-0'
        } text-white transition-opacity duration-300`}
      >
        <div
          ref={modalRef}
          className="absolute inset-0 bg-[#1c1c3d] opacity-80"
        ></div>
        <div className="relative z-50 w-[250px] rounded-md bg-[#060621] p-8 py-12 pb-10 pt-6 md:w-[500px]">
          <div onClick={onClose} className="absolute right-5 top-5">
            <img
              alt="frax"
              src="/images/delete.svg "
              className="w-[25px]  cursor-pointer rounded-[7px] p-[5px] hover:bg-[#c9c9c921]"
            ></img>
          </div>
          <div className="mb-8 flex gap-x-2">
            <div className="flex items-center gap-x-3">
              <img
                alt="delete"
                src="/images/workspace/crossfi.png"
                className="w-[20px]"
              ></img>
              <div className="text-[20px]">On-ramp Crossfi</div>
            </div>
            <img
              alt="ethereum avatar"
              src="/images/header/help.svg"
              className="mb-2 w-[15px] cursor-pointer rounded-full"
              onMouseEnter={() => setIsInfoOpen(true)}
              onMouseLeave={() => setIsInfoOpen(false)}
            ></img>
            {isInfoOpen && (
              <div className="absolute right-0 flex w-fit max-w-[400px] -translate-y-[110%] translate-x-[20%] items-center rounded-[6px]   border-[1px]   border-[#cfcfcf81] bg-[#060621]  px-[10px]  py-[7px] text-center text-[12px]">
                For Brazilian citizens, you can now enter the Crossfi world by
                buying synthetics directly through Pix payments. After sending
                the Pix order, the tokens will be transferred to your wallet
                immediately.
              </div>
            )}
          </div>
          <div>
            <img
              alt="ethereum avatar"
              src={pixData?.qrCodeImage}
              className="mx-auto mb-2 w-[150px] 2xl:w-[300px]"
            ></img>
          </div>
          <div className="mt-4 flex gap-x-2 px-5">
            <div className="w-full break-words text-[#0354EC]">
              {pixData?.brCode}
            </div>
            <img
              alt="ethereum avatar"
              src="/images/workspace/copy.svg"
              className="w-[20px] cursor-pointer rounded-full"
              onClick={(event) => {
                event.stopPropagation()
                navigator.clipboard.writeText(pixData?.brCode)
                toast.success('Code copied')
              }}
            ></img>
          </div>
          <div className="mt-3 px-5">
            You are receiving: {String(Number(amountToReceive))} {token} tokens
          </div>
          <div className="relative ml-auto mt-10 flex justify-between">
            <div
              className={`ml-auto cursor-pointer rounded-[5px] bg-[#c22336] p-[4px] px-[15px] text-[14px] text-[#fff]`}
              onClick={() => {
                setOnRampStatus(OnRampStatus.ORDER_CREATION)
              }}
            >
              Cancel
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default OnRampModalSyn
