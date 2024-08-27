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
import {
  DepinDeploymentProps,
  FakeDepinProps,
  LeasesProps,
  NewDepinDeploymentProps,
} from '@/types/depin'
import {
  blockHeightToDate,
  formatDate,
  transformString,
  wait,
} from '@/utils/functions'
import LottiePlayer from 'react-lottie-player'
import { useAccount } from 'wagmi'
import { chainToCopy } from '@/blockchain/utils/chainToMetaData'

const MainPage = ({ id }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingCompilation, setIsLoadingCompilation] = useState(false)
  const [isInfoBalanceOpen, setIsInfoBalanceOpen] = useState(false)
  const [value, setValue] = useState('// start your code here')
  const [descRefresh, setDescRefresh] = useState<any>()
  const [depinLoading, setDepinLoading] = useState<string[]>([])
  const monaco = useMonaco()
  const [depins, setDepins] = useState<NewDepinDeploymentProps[]>([])
  const [newDepins, setNewDepins] = useState<FakeDepinProps[]>([])
  const [leases, setLeases] = useState<LeasesProps[]>([])
  const [selected, setSelected] = useState<ValueObject>(depinOptionsFeatures[0])
  const [selectedNetwork, setSelectedNetwork] = useState<ValueObject>(
    depinOptionsNetwork[0],
  )
  const { address, chain } = useAccount()
  const { acoUser, acoChain } = useContext(AccountContext)

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

  function formatDate(createdAt) {
    const date = new Date(createdAt)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const formattedDate = date.toISOString().split('T')[0]

    return `${hours}:${minutes}, ${formattedDate}`
  }

  async function getDepinInfo(owner: string, dseq: string) {
    try {
      // getting deployments
      // example: https://api.akashnet.net/akash/deployment/v1beta3/deployments/list?filters.owner=akash1c3er49222vygzm6g4djr52muf3mspqam6cpqpy&pagination.limit=1000&filters.state=active&pagination.count_total=true
      const config = {
        method: `get`,
        url: `https://api.akashnet.net/akash/deployment/v1beta3/deployments/list?filters.owner=${owner}&dseq=${dseq}&pagination.limit=1000&filters.state=active&pagination.count_total=true`,
      }

      let finalData

      await axios(config).then(function (response) {
        if (response.data) {
          finalData = response.data
          console.log('api response')
          console.log(finalData)
        }
      })

      // example: https://api.akashnet.net/akash/market/v1beta4/leases/list?filters.owner=akash1c3er49222vygzm6g4djr52muf3mspqam6cpqpy&pagination.limit=1000&filters.state=active&pagination.count_total=true
      const config2 = {
        method: `get`,
        url: `https://api.akashnet.net/akash/market/v1beta4/leases/list?filters.owner=${owner}&dseq=${dseq}&pagination.limit=1000&filters.state=active&pagination.count_total=true`,
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
      return {
        deployment: finalData?.deployments[0]?.deployment,
        groups: finalData?.deployments[0]?.groups,
        escrow_account: finalData?.deployments[0]?.escrow_account,
        lease: finalDataLeases?.leases[0],
      }
    } catch (err) {
      console.log(err)
      toast.error(`Error: ${err.response.data.message}`)
    }
  }

  async function checkDeployment(id: string, tokenId: string) {
    if (depinLoading.includes(id)) {
      return
    }
    const newDepinLoading = [...depinLoading]
    newDepinLoading.push(id)
    setDepinLoading(newDepinLoading)

    try {
      // getting deployments
      const resData = await callAxiosBackend(
        'get',
        `/blockchain/depin/functions/checkDeployment?tokenId=${tokenId}`,
        'userSessionToken',
      )
      const newDepins = [...depins]
      const index = newDepins.findIndex((dp) => dp.id === id)
      if (resData?.dseq) {
        const info = await getDepinInfo(resData.akashOwner, resData.dseq)
        resData.deployment = info.deployment
        resData.groups = info.groups
        resData.escrow_account = info.escrow_account
        resData.lease = info.lease
      }
      newDepins[index] = resData

      setDepins(newDepins)
    } catch (err) {
      console.log(err)
      toast.error(`Error: ${err.response.data.message}`)
    }

    const updatedDepinLoading = newDepinLoading.filter(
      (loadingId) => loadingId !== id,
    )
    setDepinLoading(updatedDepinLoading)
  }

  async function getData() {
    setIsLoading(true)
    if (address) {
      try {
        // getting deployments
        const resData = await callAxiosBackend(
          'get',
          `/blockchain/depin/functions/getDeployments?address=${address}`,
          'userSessionToken',
        )

        if (resData?.length > 0) {
          console.log('entrei aqui sim')
          for (let i = 0; i < resData?.length; i++) {
            if (resData[i]?.dseq) {
              console.log('tem dseq')
              await wait(500)
              const info = await getDepinInfo(
                resData[i]?.akashOwner,
                resData[i]?.dseq,
              )
              console.log('Info response')
              console.log(info)
              resData[i].deployment = info.deployment
              resData[i].groups = info.groups
              resData[i].escrow_account = info.escrow_account
              resData[i].lease = info.lease
            }
          }
        }

        setDepins(resData)
      } catch (err) {
        console.log(err)
        toast.error(`Error: ${err.response.data.message}`)
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    getData()
  }, [address])

  if (isLoading) {
    return (
      <div className="container grid w-full gap-y-[30px]  text-[16px] md:pb-20 lg:pb-28 lg:pt-40">
        <div className="h-20 w-full animate-pulse rounded-[5px] bg-[#1d1f23b6]"></div>
        <div className="h-40 w-full animate-pulse rounded-[5px] bg-[#1d1f23b6]"></div>
      </div>
    )
  }

  if (depins?.length === 0 && !isLoading) {
    return (
      <>
        <section className="relative z-10 h-full overflow-hidden  pb-5 pt-2 text-center lg:pt-40">
          <div className="mx-auto w-[300px]">
            <LottiePlayer
              loop
              animationData={require('./mo.json')}
              play
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
          <div className="text-2xl text-white 2xl:text-2xl">
            No deployments found
          </div>
          <div
            onClick={() => {
              push('/feats/depin/builder')
            }}
            className={`${
              isLoading &&
              '!hover:bg-current animate-pulse !cursor-auto !bg-[#4765eaad]'
            } mx-auto mt-10 max-w-[200px] cursor-pointer rounded-md bg-[#4766EA] px-3 py-1 text-white hover:bg-[#3A51B0]`}
          >
            Create first deployment
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <section className="relative z-10 h-full overflow-hidden  pb-5 pt-2 lg:pt-40">
        <div className="container px-12">
          <div className="flex items-center gap-x-3">
            <div className="w-[40px]">
              <LottiePlayer
                loop
                animationData={require('./orb.json')}
                play
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
            <div className="text-2xl text-white 2xl:text-2xl">Deployments</div>
          </div>
          <div className="mt-10">
            <div className="flex w-full border-y-[0.5px] border-[#c9c9cb10] px-[15px] py-4 text-xs text-gray">
              <div className="w-full max-w-[22%]">Name</div>
              <div className="w-full max-w-[23%]">Specs</div>
              <div className="w-full max-w-[15%]">Balance</div>
              <div className="w-full max-w-[20%]">Rate</div>
              <div className="w-full max-w-[10%]">Created at</div>
            </div>
          </div>
          {depins?.map((app, index) => (
            <div key={index} className="">
              {app?.loading ? (
                <div
                  key={index}
                  className={`flex items-center  ${
                    index !== depins?.length - 1 &&
                    'border-b-[1px] border-[#c5c4c41a]'
                  } cursor-auto gap-x-[2px] px-[15px] py-[35px] text-[15px] font-normal text-gray`}
                >
                  {!depinLoading.includes(app?.id) ? (
                    <>
                      <div className="w-full max-w-[20%] overflow-hidden truncate text-ellipsis whitespace-nowrap">
                        {app?.name}
                      </div>
                      <div className="ml-5 flex items-center gap-x-4">
                        <img
                          alt="image"
                          src="/images/loading/loading.svg"
                          className="w-5 animate-spin"
                        />
                        <div className="flex gap-x-4">
                          Deploying:{' '}
                          <a
                            href={`${chainToCopy[acoChain]?.explore}/${app?.evmHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="cursor-pointer text-blue"
                          >
                            {app?.evmHash}
                          </a>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="h-7 w-[80%] animate-pulse rounded-[5px] bg-[#1d1f23b6]"></div>
                  )}

                  <div
                    onClick={() => {
                      checkDeployment(app.id, app.tokenId)
                    }}
                    onMouseEnter={() => {
                      setDescRefresh(index)
                    }}
                    onMouseLeave={() => {
                      setDescRefresh(null)
                    }}
                    className="relative ml-auto mr-24"
                  >
                    <img
                      alt="image"
                      src="/images/loading/refresh.svg"
                      className={`w-5 cursor-pointer ${
                        depinLoading.includes(app?.id) && 'animate-spin'
                      }`}
                    />
                    {descRefresh === index && (
                      <div className="absolute top-7 flex -translate-x-[40%] whitespace-nowrap rounded-md bg-[#000] px-2 py-1 text-xs text-white">
                        Refresh loader
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  onClick={(event) => {
                    push(`/feats/depin/${app?.dseq}`)
                  }}
                  key={index}
                  className={`flex items-center  ${
                    index !== depins?.length - 1 &&
                    'border-b-[1px] border-[#c5c4c41a]'
                  } cursor-pointer gap-x-[2px] px-[15px] py-[20px] text-[15px] font-normal text-gray hover:bg-[#7775840c]`}
                >
                  <div className="w-full max-w-[20%] overflow-hidden truncate text-ellipsis whitespace-nowrap">
                    {app?.name}
                  </div>
                  <div className="w-full max-w-[25%] overflow-hidden truncate text-ellipsis whitespace-nowrap">
                    <div className="relative grid w-fit gap-y-1 rounded-md border-[1px] border-[#c9c9cb49] px-5 py-2 text-xs">
                      <div className="flex items-center gap-x-1">
                        <img
                          alt="image"
                          src="/images/explore/cpu.svg"
                          className="w-3"
                        />
                        <div>
                          {' '}
                          {(
                            Number(
                              app?.groups?.at(0)?.group_spec?.resources?.at(0)
                                ?.resource?.cpu?.units?.val,
                            ) /
                            10 ** 3
                          ).toFixed(1)}{' '}
                          cpu
                        </div>
                      </div>
                      <div className="flex items-center gap-x-1">
                        <img
                          alt="image"
                          src="/images/explore/storage.svg"
                          className="w-3"
                        />
                        <div>
                          {' '}
                          {(
                            Number(
                              app?.groups
                                ?.at(0)
                                ?.group_spec?.resources?.at(0)
                                ?.resource?.storage?.at(0)?.quantity?.val,
                            ) /
                            10 ** 6
                          ).toFixed(0)}{' '}
                          mb
                        </div>
                      </div>
                      <div className="flex items-center gap-x-1">
                        <img
                          alt="image"
                          src="/images/explore/memory.svg"
                          className="w-3"
                        />
                        <div>
                          {' '}
                          {(
                            Number(
                              app?.groups?.at(0)?.group_spec?.resources?.at(0)
                                ?.resource?.memory?.quantity?.val,
                            ) /
                            10 ** 6
                          ).toFixed(0)}{' '}
                          mb
                        </div>
                      </div>
                      <div className="absolute right-1 top-1 h-1 w-1 animate-pulse rounded-full bg-[#6FD572]"></div>
                    </div>
                  </div>
                  <div className="w-full max-w-[15%] overflow-hidden truncate text-ellipsis whitespace-nowrap">
                    AKT{' '}
                    {(
                      Number(app?.escrow_account?.balance?.amount) /
                      10 ** 6
                    )?.toFixed(2)}
                  </div>
                  <div className="w-full max-w-[20%] overflow-hidden truncate text-ellipsis whitespace-nowrap">
                    USD{' '}
                    {Number(app?.lease?.escrow_payment?.rate?.amount)?.toFixed(
                      2,
                    )}{' '}
                    / month
                  </div>
                  <div className="w-full max-w-[10%] overflow-hidden truncate text-ellipsis whitespace-nowrap">
                    {formatDate(app?.createdAt)}
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
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default MainPage
