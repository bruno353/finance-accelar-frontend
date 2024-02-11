'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, useContext } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { deleteApp } from '@/utils/api-blockchain'
import { BlockchainWalletProps, ICPWalletsProps } from '@/types/blockchain-app'

export interface MenuI {
  wallet: BlockchainWalletProps
  onConfirmTransaction(): void
}

const ConfirmDeployICPWalletModal = ({
  wallet,
  onConfirmTransaction,
}: MenuI) => {
  return (
    <>
      <div className="h-full w-fit rounded-[10px]  border-[1px] border-[#33323e] bg-[#060621] p-[15px] text-[12px] font-normal text-[#c5c4c4]">
        <div className="grid gap-y-[10px]">
          <div>
            You are deploying a new canister-wallet for the identity{' '}
            {wallet.icpWalletPubKId}
            {}
          </div>
          <div className="mt-2 flex justify-between">
            <div
              className={`${'cursor-pointer  hover:bg-[#35428a]'} rounded-[5px] bg-[#273687] p-[4px] px-[15px] text-[14px] text-[#fff] `}
              onClick={() => {
                onConfirmTransaction()
              }}
            >
              Confirm transaction
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ConfirmDeployICPWalletModal
