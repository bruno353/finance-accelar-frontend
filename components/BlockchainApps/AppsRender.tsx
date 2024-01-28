/* eslint-disable jsx-a11y/alt-text */
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
import 'react-quill/dist/quill.snow.css' // import styles
import 'react-datepicker/dist/react-datepicker.css'
import {
  changeUserWorkspaceRole,
  createWorkspace,
  inviteUserToWorkspace,
  updateWorkspace,
  updateWorkspaceLogo,
} from '@/utils/api'
import nookies, { parseCookies, destroyCookie, setCookie } from 'nookies'
import { UserWorkspaceProps } from '@/types/workspace'
import { BlockchainAppProps } from '@/types/blockchain-app'

export interface ModalI {
  apps: BlockchainAppProps[]
  isUserAdmin: boolean
  onUpdate(): void
}

const AppsRender = ({ apps, isUserAdmin }: ModalI) => {
  const [memberEmailToAdd, setMemberEmailToAdd] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState<any>()
  const [isUserModalOpen, setIsUserModalOpen] = useState<any>()

  const [selected, setSelected] = useState<any>('normal')

  const menuRef = useRef(null)

  const optionsMembers = [
    {
      name: 'Member',
      value: 'normal',
    },
    {
      name: 'Admin',
      value: 'admin',
    },
  ]
  const handleInputChange = (e) => {
    if (!isLoading) {
      setMemberEmailToAdd(e.target.value)
    }
  }

  const closeMenu = () => {
    setIsDeleteUserOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        // Clicked outside of the menu, so close it
        closeMenu()
      }
    }

    // Add event listener when the menu is open
    if (isDeleteUserOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      // Remove event listener when the menu is closed
      document.removeEventListener('mousedown', handleClickOutside)
    }

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDeleteUserOpen])

  const roleToValue = {
    normal: 'Member',
    admin: 'Admin',
  }

  function NoAppsFound() {
    return (
      <div className="mx-auto w-fit items-center justify-center text-[15px] font-light">
        <SmileySad size={32} className="text-blue-500 mx-auto  mb-2" />
        <span>No Apps found, create your first App</span>
      </div>
    )
  }

  return (
    <div className="pb-[80px] text-[14px] text-[#C5C4C4]">
      <div className="mt-[50px] text-[16px] font-normal">
        <div className="mt-[20px] grid gap-y-[25px]">
          {apps?.length === 0 ? (
            NoAppsFound()
          ) : (
            <div>
              <div className="flex w-full rounded-t-md bg-[#c5c4c40e] px-[15px] py-[5px]">
                <div className="w-full max-w-[40%]">App name</div>
                <div className="w-full max-w-[30%]">Network</div>
                <div className="w-full max-w-[20%]">created at</div>
              </div>
              {apps?.map((app, index) => (
                <div
                  key={index}
                  className="flex items-center text-[15px] font-normal"
                >
                  <div className="w-full max-w-[40%]">{app.name}</div>
                  <div className="w-full max-w-[30%]">{app.network}</div>
                  <div className="w-full max-w-[20%]">{app.createdAt}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AppsRender
