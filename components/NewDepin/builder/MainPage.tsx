/* eslint-disable @next/next/no-img-element */
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
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css' // import styles
import 'react-datepicker/dist/react-datepicker.css'
import { parseCookies } from 'nookies'
import { AccountContext } from '../../../contexts/AccountContext'
// import NewWorkspaceModal from './NewWorkspace'
import { getBlockchainApps, getUserWorkspace, getWorkspace } from '@/utils/api'
import { WorkspaceProps } from '@/types/workspace'
import SubNavBar from '../../Modals/SubNavBar'
import { Logo } from '../../Sidebar/Logo'
import { BlockchainWalletProps } from '@/types/blockchain-app'
import { getBlockchainWallets } from '@/utils/api-blockchain'
// import NewAppModal from './Modals/NewAppModal'
import Editor, { useMonaco } from '@monaco-editor/react'
import Dropdown, { ValueObject } from '../../Modals/Dropdown'
import { depinOptionsFeatures, depinOptionsNetwork } from '@/types/consts/depin'
import { callAxiosBackend } from '@/utils/general-api'
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import {
  DepinDeploymentProps,
  LeasesProps,
  NewDepinDeploymentProps,
} from '@/types/depin'
import {
  blockHeightToDate,
  formatDate,
  transformString,
} from '@/utils/functions'
import NewDeployment from './NewDeployment'

const MainPage = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingCompilation, setIsLoadingCompilation] = useState(false)
  const [subMenuOption, setSubMenuOption] = useState<string>('Lease')

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [value, setValue] = useState('// start your code here')
  const [languageSelectorOpen, setLanguageSelectorOpen] = useState(false)
  const monaco = useMonaco()
  const [depin, setDepin] = useState<NewDepinDeploymentProps>()
  const [lease, setLease] = useState<LeasesProps>()
  const [provider, setProvider] = useState<any>()

  const [selected, setSelected] = useState<ValueObject>(depinOptionsFeatures[0])
  const [selectedNetwork, setSelectedNetwork] = useState<ValueObject>(
    depinOptionsNetwork[0],
  )

  const [navBarSelected, setNavBarSelected] = useState('Deployments')
  const [blockchainWallets, setBlockchainWallets] = useState<
    BlockchainWalletProps[]
  >([])

  const {
    workspace,
    user,
    isDeployingNewDepinFeature,
    setIsDeployingNewDepingFeature,
  } = useContext(AccountContext)

  const { push } = useRouter()
  const pathname = usePathname()

  const editorRef = useRef()
  const [language, setLanguage] = useState('')

  const onMount = (editor) => {
    editorRef.current = editor
    editor.focus()
  }
  const menuRef = useRef(null)

  async function getData() {
    setIsLoading(true)

    try {
      const config = {
        method: `get`,
        url: `https://api.akashnet.net/akash/deployment/v1beta3/deployments/list?filters.owner=akash1c3er49222vygzm6g4djr52muf3mspqam6cpqpy&pagination.limit=1000&filters.dseq=17511329&pagination.count_total=true`,
      }

      let finalData

      try {
        await axios(config).then(function (response) {
          if (response.data) {
            finalData = response.data
            console.log('api response')
            console.log(finalData)
          }
        })
      } catch (err) {
        console.log(err)
      }

      const config2 = {
        method: `get`,
        url: `https://api.akashnet.net/akash/market/v1beta4/leases/list?filters.owner=akash1c3er49222vygzm6g4djr52muf3mspqam6cpqpy&filters.dseq=17511329&pagination.limit=1000&pagination.count_total=true`,
      }

      let finalDataLeases

      try {
        await axios(config2).then(function (response) {
          if (response.data) {
            finalDataLeases = response.data
            console.log('api response')
            console.log(finalData)
          }
        })
      } catch (err) {
        console.log(err)
      }

      let finalProviders

      try {
        finalProviders = await callAxiosBackend(
          'get',
          `/blockchain/depin/functions/getAkashProviders`,
          'userSessionToken',
        )
      } catch (err) {
        console.log(err)
      }

      // finding the provider
      const provider = finalProviders?.find(
        (pv) =>
          pv.owner === finalDataLeases?.leases[0]?.lease?.lease_id?.provider,
      )

      setLease(finalDataLeases?.leases[0])
      setDepin(finalData?.deployments[0]) //
      setProvider(provider)
      // getting leases
    } catch (err) {
      console.log(err)
      toast.error(`Error: ${err}`)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    setIsLoading(true)
    getData()
  }, [])

  const subMenu = ['Lease', 'Info']

  const uptimePercentage = provider
    ? (provider.uptime7d * 100 - 1).toFixed(0)
    : 0
  const downtimePercentage = 100 - Number(uptimePercentage)
  const COLORS = ['#FE886D', '#6FD572'] // Green for uptime, Orange for downtime

  const data = [
    { name: 'Uptime', value: uptimePercentage },
    { name: 'Downtime', value: downtimePercentage },
  ]

  const nameRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (nameRef.current && !nameRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  if (isLoading) {
    return (
      <div className="container grid w-full gap-y-[30px]  text-[16px] md:pb-20 lg:pb-28 lg:pt-40">
        <div className="h-20 w-full animate-pulse rounded-[5px] bg-[#1d1f23b6]"></div>
        <div className="h-40 w-full animate-pulse rounded-[5px] bg-[#1d1f23b6]"></div>
      </div>
    )
  }

  return (
    <>
      <section className="relative z-10 h-full overflow-hidden  pb-5 pt-2 lg:pt-40">
        <div className="container px-12">
          <NewDeployment
            onUpdate={() => {
              console.log('')
            }}
          />
        </div>
      </section>
    </>
  )
}

export default MainPage
