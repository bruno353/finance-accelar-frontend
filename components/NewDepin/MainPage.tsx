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
import { AccountContext } from '../../contexts/AccountContext'
// import NewWorkspaceModal from './NewWorkspace'
import { getBlockchainApps, getUserWorkspace, getWorkspace } from '@/utils/api'
import { WorkspaceProps } from '@/types/workspace'
import SubNavBar from '../Modals/SubNavBar'
import { Logo } from '../Sidebar/Logo'
import { BlockchainWalletProps } from '@/types/blockchain-app'
import { getBlockchainWallets } from '@/utils/api-blockchain'
// import NewAppModal from './Modals/NewAppModal'
import Editor, { useMonaco } from '@monaco-editor/react'
import Dropdown, { ValueObject } from '../Modals/Dropdown'
import { depinOptionsFeatures, depinOptionsNetwork } from '@/types/consts/depin'
import { callAxiosBackend } from '@/utils/general-api'
import { DepinDeploymentProps, LeasesProps, NewDepinDeploymentProps } from '@/types/depin'
import { blockHeightToDate, formatDate, transformString } from '@/utils/functions'

const MainPage = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingCompilation, setIsLoadingCompilation] = useState(false)
  const [isInfoBalanceOpen, setIsInfoBalanceOpen] = useState(false)
  const [value, setValue] = useState('// start your code here')
  const [languageSelectorOpen, setLanguageSelectorOpen] = useState(false)
  const monaco = useMonaco()
  const [depins, setDepins] = useState<NewDepinDeploymentProps[]>([])
  const [leases, setLeases] = useState<LeasesProps[]>([])
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
        //getting deployments

        const config = {
            method: `get`,
            url: `https://api.akashnet.net/akash/deployment/v1beta3/deployments/list?filters.owner=akash1c3er49222vygzm6g4djr52muf3mspqam6cpqpy&pagination.limit=1000&filters.state=active&pagination.count_total=true`,
        }
        
        let finalData
        
        await axios(config).then(function (response) {
            if (response.data) {
                finalData = response.data
                console.log('api response')
                console.log(finalData)
            }
        })

        const config2 = {
            method: `get`,
            url: `https://api.akashnet.net/akash/market/v1beta4/leases/list?filters.owner=akash1c3er49222vygzm6g4djr52muf3mspqam6cpqpy&pagination.limit=1000&filters.state=active&pagination.count_total=true`,
        }
        
        let finalDataLeases
        
        await axios(config2).then(function (response) {
            if (response.data) {
                finalDataLeases = response.data
                console.log('api response')
                console.log(finalData)
            }
        })
    
      setLeases(finalDataLeases?.leases)
      setDepins(finalData?.deployments) //

      //getting leases
    } catch (err) {
      console.log(err)
      toast.error(`Error: ${err.response.data.message}`)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    setIsLoading(true)
    getData()
  }, [])

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
            <div className='text-3xl text-white'>
             Deployments
            </div>
            <div className="mt-10">
                <div className="flex w-full text-gray text-xs px-[15px] py-4 border-y-[0.5px] border-[#c9c9cb10]">
                  <div className="w-full max-w-[22%]">Dseq</div>
                  <div className="w-full max-w-[23%]">Specs</div>
                  <div className="w-full max-w-[15%]">Balance</div>
                  <div className="w-full max-w-[20%]">Rate</div>
                  <div className="w-full max-w-[10%]">Block height</div>
                </div>
            </div>
            {depins?.map((app, index) => (
                    <div
                      onClick={(event) => {
                        console.log(app)
                        console.log(leases)
                      }}
                      key={index}
                      className={`flex items-center  ${
                        index !== depins?.length - 1 &&
                        'border-b-[1px] border-[#c5c4c41a]'
                      } cursor-pointer text-gray gap-x-[2px] px-[15px] py-[20px] text-[15px] font-normal hover:bg-[#7775840c]`}
                    >
                      <div className="w-full max-w-[20%] overflow-hidden truncate text-ellipsis whitespace-nowrap">
                        {app?.deployment?.deployment_id.dseq}
                      </div>
                      <div className="w-full max-w-[25%] overflow-hidden truncate text-ellipsis whitespace-nowrap">
                        <div className='rounded-md relative text-xs border-[1px] border-[#c9c9cb49] w-fit px-5 py-2 grid gap-y-1'>
                            <div className="flex items-center gap-x-1">
                                <img
                                alt="image"
                                src="/images/explore/cpu.svg"
                                className="w-3"
                                />
                                <div>{app?.groups[0]?.group_spec?.resources[0]?.resource?.cpu?.units?.val} cpu</div>
                            </div>
                            <div className="flex items-center gap-x-1">
                                <img
                                alt="image"
                                src="/images/explore/storage.svg"
                                className="w-3"
                                />
                                <div>564 mb</div>
                            </div>
                            <div className="flex items-center gap-x-1">
                                <img
                                alt="image"
                                src="/images/explore/memory.svg"
                                className="w-3"
                                />
                                <div>564 mb</div>
                            </div>
                            <div className="absolute right-1 top-1 h-1 w-1 animate-pulse rounded-full bg-[#6FD572]"></div>
                        </div>
                      </div>
                      <div className="w-full max-w-[15%] overflow-hidden truncate text-ellipsis whitespace-nowrap">
                        AKT {(Number(app?.escrow_account?.balance?.amount) / 10 ** 6)?.toFixed(2)}
                      </div>
                      <div className="w-full max-w-[20%] overflow-hidden truncate text-ellipsis whitespace-nowrap">
                        USD {Number(leases?.find((ls) => ls?.lease?.lease_id?.dseq === app?.deployment?.deployment_id?.dseq)?.escrow_payment?.rate?.amount)?.toFixed(2)} / month
                      </div>
                      <div className="w-full max-w-[10%] overflow-hidden truncate text-ellipsis whitespace-nowrap">
                        {app?.deployment?.created_at}
                      </div>
                      <div className="ml-auto w-full max-w-[10%]">
                        {' '}
                        {/* {isEditInfoOpen === app.id && (
                          <div className="absolute flex w-fit -translate-x-[50%]   -translate-y-[100%]   items-center rounded-[6px]  bg-[#060621]  px-[10px] py-[5px] text-center">
                            Edit workflow
                          </div>
                        )}
                        {isUserAdmin && (
                          <img
                            ref={editRef}
                            alt="ethereum avatar"
                            src="/images/chat/pencil.svg"
                            className="w-[15px] cursor-pointer 2xl:w-[25px]"
                            onMouseEnter={() => setIsEditInfoOpen(app.id)}
                            onMouseLeave={() => setIsEditInfoOpen(null)}
                            onClick={(event) => {
                              event.stopPropagation()
                              setIsEditAppOpen(app.id)
                            }}
                          ></img>
                        )} */}
                      </div>
                    </div>
                  ))}
        </div>
      </section>
    </>
  )
}

export default MainPage
