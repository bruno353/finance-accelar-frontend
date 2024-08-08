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

const MainPage = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingCompilation, setIsLoadingCompilation] = useState(false)
  const [subMenuOption, setSubMenuOption] = useState<string>('Lease')

  const [isInfoBalanceOpen, setIsInfoBalanceOpen] = useState(false)
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
          <div className="relative flex w-fit items-center gap-x-2">
            <img
              alt="image"
              src="/images/explore/arrow.svg"
              className={`w-10 rotate-180 cursor-pointer rounded-md p-3 hover:bg-grayPale`}
            />
            <div className="text-4xl font-medium text-white">
              {depin?.deployment?.deployment_id.dseq}
            </div>
            <div className="absolute -right-5 top-1 h-2 w-2 animate-pulse rounded-full bg-[#6FD572]"></div>
          </div>
          <div className="flex gap-x-24">
            <div className="grid gap-y-3 pt-6 text-white">
              <div className="flex">
                <div className="w-32 text-gray">Balance</div>
                <div>
                  AKT{' '}
                  {(
                    Number(depin?.escrow_account?.balance?.amount) /
                    10 ** 6
                  )?.toFixed(2)}
                </div>
              </div>
              <div className="flex">
                <div className="w-32 text-gray">Spend rate</div>
                <div>
                  USD {Number(lease?.escrow_payment?.rate?.amount)?.toFixed(2)}{' '}
                  / month
                </div>
              </div>
              <div className="flex">
                <div className="w-32 text-gray">Blockchain H.</div>
                <div>{depin?.deployment?.created_at}</div>
              </div>
            </div>
            <div className="grid gap-y-3 pt-6 text-white">
              <div className="flex">
                <div className="w-14 text-gray">State</div>
                <div>{lease?.lease?.state}</div>
              </div>
            </div>
            <div className="relative my-auto grid w-fit gap-y-1 rounded-md border-[1px] border-[#c9c9cb10] px-5 py-2 text-sm text-white">
              <div className="flex items-center gap-x-4">
                <img
                  alt="image"
                  src="/images/explore/cpu.svg"
                  className="w-4"
                />
                <div>
                  {(
                    Number(
                      depin?.groups[0]?.group_spec?.resources[0]?.resource?.cpu
                        ?.units?.val,
                    ) /
                    10 ** 3
                  ).toFixed(1)}{' '}
                  cpu
                </div>
              </div>
              <div className="flex items-center gap-x-4 border-y-[1px] border-[#c9c9cb2e]">
                <img
                  alt="image"
                  src="/images/explore/storage.svg"
                  className="ml-[2px] w-3"
                />
                <div>
                  {(
                    Number(
                      depin?.groups[0]?.group_spec?.resources[0]?.resource
                        ?.storage[0]?.quantity?.val,
                    ) /
                    10 ** 6
                  ).toFixed(0)}{' '}
                  mb
                </div>
              </div>
              <div className="flex items-center gap-x-4">
                <img
                  alt="image"
                  src="/images/explore/memory.svg"
                  className="ml-[2px] w-3"
                />
                <div>
                  {(
                    Number(
                      depin?.groups[0]?.group_spec?.resources[0]?.resource
                        ?.memory?.quantity?.val,
                    ) /
                    10 ** 6
                  ).toFixed(0)}{' '}
                  mb
                </div>
              </div>
            </div>
          </div>
          <div>
            <ul className="mt-10 block border-b-[0.5px] border-[#c9c9cb2e] lg:flex lg:space-x-8">
              {subMenu.map((menuItem, index) => (
                <li key={menuItem} className="group relative">
                  <div
                    onClick={() => {
                      setSubMenuOption(menuItem)
                    }}
                    className={`${
                      subMenuOption === menuItem
                        ? 'border-b-[1px] border-[#fff] !text-white'
                        : ''
                    } ${
                      subMenuOption === menuItem
                        ? 'border-b-[1px] border-[#fff] !text-white'
                        : ''
                    } flex cursor-pointer py-2 text-sm text-dark group-hover:border-b-[1px] group-hover:border-[#adadae] dark:text-[#adadae] lg:mr-0 lg:inline-flex lg:px-0 lg:py-3`}
                  >
                    {menuItem}
                  </div>
                </li>
              ))}
            </ul>
            <div>
              {subMenuOption === 'Lease' && (
                <div className="mt-8 flex gap-x-16 px-4 text-sm text-gray">
                  <div className="grid h-fit gap-y-3">
                    <div>
                      Provider:{' '}
                      <span className="text-base text-white">
                        {provider?.hostUri}
                      </span>
                    </div>
                    {/* <div>Uptime: {(provider?.uptime7d * 100).toFixed(0)}</div> */}
                    <div>
                      Datacenter:{' '}
                      <span className="text-base text-white">
                        {
                          provider?.attributes?.find((vl) => vl.key === 'host')
                            ?.value
                        }
                      </span>
                    </div>
                    <div>
                      Uri: {(provider?.attributes[0]?.value * 100).toFixed(0)}
                    </div>
                  </div>
                  <div className="flex gap-x-1">
                    <div>Uptime</div>
                    <PieChart width={200} height={200}>
                      <Pie
                        data={data}
                        cx={50}
                        cy={50}
                        labelLine={false}
                        outerRadius={50}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {data.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default MainPage
