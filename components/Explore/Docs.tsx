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
import { Eye, EyeSlash } from 'phosphor-react'
import * as Yup from 'yup'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css' // import styles
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { parseCookies, destroyCookie, setCookie } from 'nookies'
import { AccountContext } from '../../contexts/AccountContext'
import Link from 'next/link'
import ReCAPTCHA from 'react-google-recaptcha'

import { createHash } from 'crypto'
import ScrollToTop from '../ScrollToTop/index'
import { SigninForm, SignupForm } from '@/types/user'
import { createUser, googleRedirect, loginUser } from '@/utils/api'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules'
import 'swiper/css' // Estilos básicos
import 'swiper/css/navigation' // Estilos de navegação
import './SwiperStyles.css'
import { Sparklines, SparklinesLine } from 'react-sparklines'

const Docs = () => {
  const [animate, setAnimate] = useState<boolean>(true)
  const swiperRef = useRef(null)
  const [mySwiper, setMySwiper] = useState<any>({})
  const [isStart, setIsStart] = useState<boolean>(true)
  const [isEnd, setIsEnd] = useState<boolean>(false)

  const { push } = useRouter()

  const feats = [
    {
      title: 'BERT',
      logoSource: '/images/explore/google-logo.webp',
      logoStyle: 'w-10 rounded-full',
      description:
        'This repository contains the necessary files to deploy a Flask application that uses the BERT language model on the Akash network. BERT is a powerful language model that can...',
      dockerImage: 'clydedevv/bert-base-uncased:0.0.8',
      cpu: '4',
      memorySize: '4Gi',
      gpu: 'Nvidia v100 - 1',
      price: '$ 370,56 / month',
      imgSource: '/images/explore/cloud.svg',
      imgStyle: 'w-6',
      active: true,
    },
    {
      title: 'Minecraft',
      logoSource: '/images/explore/minecraft-icon.svg',
      logoStyle: 'w-10',
      description:
        'Launch a Minecraft server on the Akash blockchain. It can be easily configured with only changes to deploy.yaml, and supports any Minecraft version, including multiple modded server types.',
      dockerImage: 'itzg/minecraft-server',
      cpu: '2',
      memorySize: '5Gi',
      price: '$5,28 / month',
      imgSource: '/images/explore/cloud.svg',
      imgStyle: 'w-6',
      active: true,
    },
    {
      title: 'Falcon-7B',
      logoSource: '/images/explore/falcon.png',
      logoStyle: 'w-10 rounded-full',
      description:
        'Falcon-7B-Instruct is a 7B parameters causal decoder-only model built by TII based on Falcon-7B and finetuned on a mixture of chat/instruct datasets. It is made available under the...',
      dockerImage: 'andrey01/falcon7b:0.4',
      cpu: '8',
      memorySize: '100Gi',
      gpu: 'Nvidia a100 - 1',
      price: '$510,20 / month',
      imgSource: '/images/explore/cloud.svg',
      imgStyle: 'w-6',
      active: true,
    },
    {
      title: 'Cosmos Hub',
      logoSource: '/images/explore/cosmos.svg',
      logoStyle: 'w-10',
      description:
        'Deploy a set of the cosmos chain. Customize your appchain from business logic to block production. Sovereignty means you control every aspect of consensus, governance...',
      dockerImage:
        'ghcr.io/akash-network/cosmos-omnibus:v0.4.23-cosmoshub-v18.1.0',
      cpu: '4',
      memorySize: '100Gi',
      price: '$11,89 / month',
      imgSource: '/images/explore/cloud.svg',
      imgStyle: 'w-6',
      active: true,
    },
    {
      title: 'Stable Diffusion',
      logoSource: '/images/explore/stable-diffusion.png',
      logoStyle: 'w-10',
      description:
        'The easiest way to install and use Stable Diffusion on your computer. Does not require technical knowledge, does not require pre-installed software. 1-click install, powerful features...',
      dockerImage: 'ghcr.io/spacepotahto/qbittorrent:1.0.0',
      cpu: '16',
      memorySize: '32Gi',
      gpu: 'Nvidia rtx4090 - 1',
      price: '$341,06 / month',
      imgSource: '/images/explore/cloud.svg',
      imgStyle: 'w-6',
      active: true,
    },
  ]

  const trendingAssets = [
    {
        title: 'CLP-XFI Pool',
        desc: 'APR: 17.85%',
        type: 'Credit',
        imgSource: '/images/explore/bank-white.svg',
        imgStyle: 'flex-0 w-[30px] rounded-full bg-[#4766EA] p-1',
        linkPoolAddress: 'https://snowtrace.io/address/0xc31097688d0d0f87b55d0715fddacd674e4435dc',
        poolAddress: '0xad4...35dc',
        priceDif: 5.4,
        valueAmount: '124.30',
        chartData: [50, 52, 54, 58, 60, 59, 59, 53, 51, 50, 55, 59, 64, 65, 68, 72, 67, 62, 58, 54, 55, 52, 50, 46, 45, 48, 53, 58, 62, 67, 69, 69, 65, 72, 80, 85],
    },
    {
        title: 'GOLD-XFI Pool',
        desc: 'Backed by XDAI',
        type: 'Synthetics',
        imgSource: '/images/explore/money-white.svg',
        imgStyle: 'flex-0 w-[30px] rounded-full bg-[#4766EA] p-1',
        linkPoolAddress: 'https://snowtrace.io/address/0xc31097688d0d0f87b55d0715fddacd674e4435dc',
        poolAddress: '0xad4...35dc',
        priceDif: -2.2,
        valueAmount: '2,441.3',
        chartData: [20, 22, 25, 32, 40, 49, 49, 53, 51, 50, 42, 41, 39, 37, 41, 46, 52, 55, 58, 54, 55, 52, 50, 46, 45, 48, 53, 58, 62, 67, 69, 69, 65, 60, 50, 42],
      },
      {
        title: '18SML711-XFI',
        desc: 'Singapore property',
        type: 'Real State',
        imgSource: '/images/explore/real-state-white.svg',
        imgStyle: 'flex-0 w-[30px] rounded-full bg-[#4766EA] p-1',
        linkPoolAddress: 'https://app.citadao.io/properties/0xa1e567790dd08c0d91c6522744715c4a4971233c',
        poolAddress: '0xa1e...233c',
        priceDif: -5.2,
        valueAmount: '635,000',
        chartData: [20, 25, 29, 32, 40, 49, 55, 59, 63, 56, 65, 55, 48, 39, 41, 46, 52, 55, 58, 54, 50, 48, 40, 46, 45, 48, 53, 58, 62, 67, 69, 69, 65, 70, 72, 65],
      },
      {
        title: 'PARCL-XFI Pool',
        desc: 'USA market exposure',
        type: 'Real State',
        imgSource: '/images/explore/real-state-white.svg',
        imgStyle: 'flex-0 w-[30px] rounded-full bg-[#4766EA] p-1',
        linkPoolAddress: 'https://app.citadao.io/properties/0xa1e567790dd08c0d91c6522744715c4a4971233c',
        poolAddress: '0xa1e...233c',
        priceDif: 3.1,
        valueAmount: '235,000',
        chartData: [50, 45, 40, 42, 40, 49, 55, 59, 63, 63, 65, 59, 55, 50, 48, 46, 52, 63, 58, 54, 50, 48, 42, 46, 44, 48, 53, 58, 62, 67, 68, 69, 65, 70, 72, 78],
      },
  ]

  useEffect(() => {
    if (mySwiper?.isBeginning) {
      setIsStart(true)
    } else {
      setIsStart(false)
    }
  }, [mySwiper])

  return (
    <>
      <section className="relative z-10 h-full overflow-hidden  pb-52 pt-2 lg:pt-40">
        <div className="mx-auto flex w-[1000px] items-center gap-x-5 text-4xl text-white mb-10">
          <div className="">
          <svg width="40" height="45" viewBox="0 0 40 45" className="fill-[#4766EA]">
                <path
                opacity="0.5"
                d="M31.579 37.8948C28.6737 37.8948 26.3158 35.5369 26.3158 32.6317C26.3158 31.9159 26.4527 31.2306 26.7135 30.6015C26.7959 30.4027 26.7605 30.1711 26.6083 30.019L24.9997 28.4103C24.7766 28.1872 24.4043 28.2238 24.2487 28.4983C23.5588 29.7145 23.1579 31.125 23.1579 32.6317C23.1579 37.2843 26.9263 41.0527 31.579 41.0527V43.0035C31.579 43.449 32.1175 43.6721 32.4325 43.3571L35.9622 39.8273C36.1575 39.6321 36.1575 39.3155 35.9622 39.1202L32.4325 35.5905C32.1175 35.2755 31.579 35.4986 31.579 35.9441V37.8948ZM31.579 24.2106V22.2598C31.579 21.8144 31.0404 21.5913 30.7254 21.9063L27.1957 25.436C27.0004 25.6313 27.0004 25.9479 27.1957 26.1431L30.7254 29.6729C31.0404 29.9879 31.579 29.7648 31.579 29.3193V27.3685C34.4842 27.3685 36.8421 29.7264 36.8421 32.6317C36.8421 33.3474 36.7052 34.0328 36.4444 34.6618C36.362 34.8606 36.3974 35.0922 36.5496 35.2444L38.1582 36.853C38.3813 37.0762 38.7536 37.0396 38.9092 36.7651C39.5991 35.5488 40 34.1384 40 32.6317C40 27.9791 36.2316 24.2106 31.579 24.2106Z"
                />
                <path d="M18.9474 32.6316C18.9474 35.4705 19.8099 38.0969 21.2941 40.2796C21.7904 41.0094 21.3054 42.1053 20.4229 42.1053H4.21053C1.87368 42.1053 0 40.2316 0 37.8947V4.21053C0 1.89474 1.87368 0 4.21053 0H6.31579H16.8421H29.4737C31.7895 0 33.6842 1.87368 33.6842 4.21053V17.9544C33.6842 18.5032 33.1804 18.9474 32.6316 18.9474C25.0737 18.9474 18.9474 25.0737 18.9474 32.6316Z" />
            </svg>
          </div>
          <div>Docs</div>
        </div>
        <div className="gap-y-10 grid grid-cols-2 gap-x-20 px-20 justify-center">
            <div className='relative w-full'>
                <img
                alt="image"
                src='/images/explore/network.webp'
                className='w-full h-[200px] rounded-lg opacity-30 transition-transform duration-300 ease-in-out hover:-rotate-1'
                >
                </img>
                <div className='absolute text-white bottom-8 left-5'>
                    <div className='text-base'>
                        Beta version live!
                    </div>
                    <div className='text-2xl font-semibold'>
                        Accelar Protocol
                    </div>
                    <div className="mt-4 cursor-pointer text-sm w-fit rounded-md bg-[#4766EA] px-5 py-1 text-white hover:bg-[#3A51B0]">
                    Test now
                    </div>
                </div>
            </div>
            <div className='relative w-full'>
                <img
                alt="image"
                src='/images/explore/retro.jpeg'
                className='w-full h-[200px] rounded-lg opacity-30 transition-transform duration-300 ease-in-out hover:-rotate-1'
                >
                </img>
                <div className='absolute text-white bottom-8 left-5'>
                    <div className='text-base'>
                        Accelar integration with Akash
                    </div>
                    <div className='text-2xl font-semibold'>
                        DePin on Crossfi
                    </div>
                    <div className="mt-4 cursor-pointer text-sm w-fit rounded-md border-[1px] border-[#D8AB15] bg-transparent px-5 py-1 text-[#D8AB15] hover:bg-[#d8aa1566]">
                      Create deployment
                    </div>
                </div>
            </div>
            <div className='relative w-full'>
                <img
                alt="image"
                src='/images/explore/scifi.jpeg'
                className='w-full h-[200px] rounded-lg opacity-30 transition-transform duration-300 ease-in-out hover:-rotate-1'
                >
                </img>
                <div className='absolute text-white bottom-8 left-5'>
                    <div className='text-base'>
                        Real time trading
                    </div>
                    <div className='text-2xl font-semibold'>
                        Exposure to Real State market on Crossfi
                    </div>
                    <div className="mt-4 cursor-pointer text-sm w-fit rounded-md bg-[#4766EA] px-5 py-1 text-white hover:bg-[#3A51B0]">
                        Join pool
                    </div>
                </div>
            </div>
            <div className='text-[#4766EA] text-sm  grid h-fit gap-y-2'>
                <div className='text-white text-base mb-1'>
                    More
                </div>
                <div className='underline cursor-pointer'>
                    How does Accelar oracle work?
                </div>
                <div className='underline cursor-pointer'>
                    Crossfi docs
                </div>
                <div className='underline cursor-pointer'>
                    Building on top of Accelar infrastructure
                </div>
            </div>
        </div>
      </section>
    </>
  )
}

export default Docs
