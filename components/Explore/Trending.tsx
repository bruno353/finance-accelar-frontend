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

const Trending = () => {
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
      imgStyle: 'flex-0 w-[20px] md:w-[30px] rounded-full bg-[#4766EA] p-1',
      linkPoolAddress:
        'https://snowtrace.io/address/0xc31097688d0d0f87b55d0715fddacd674e4435dc',
      poolAddress: '0xad4...35dc',
      priceDif: 5.4,
      valueAmount: '124.30',
      chartData: [
        50, 52, 54, 58, 60, 59, 59, 53, 51, 50, 55, 59, 64, 65, 68, 72, 67, 62,
        58, 54, 55, 52, 50, 46, 45, 48, 53, 58, 62, 67, 69, 69, 65, 72, 80, 85,
      ],
    },
    {
      title: 'GOLD-XFI Pool',
      desc: 'Backed by XDAI',
      type: 'Synthetics',
      imgSource: '/images/explore/money-white.svg',
      imgStyle: 'flex-0 w-[20px] md:w-[30px] rounded-full bg-[#4766EA] p-1',
      linkPoolAddress:
        'https://snowtrace.io/address/0xc31097688d0d0f87b55d0715fddacd674e4435dc',
      poolAddress: '0xad4...35dc',
      priceDif: -2.2,
      valueAmount: '2,441.3',
      chartData: [
        20, 22, 25, 32, 40, 49, 49, 53, 51, 50, 42, 41, 39, 37, 41, 46, 52, 55,
        58, 54, 55, 52, 50, 46, 45, 48, 53, 58, 62, 67, 69, 69, 65, 60, 50, 42,
      ],
    },
    {
      title: '18SML711-XFI',
      desc: 'Singapore property',
      type: 'Real State',
      imgSource: '/images/explore/real-state-white.svg',
      imgStyle: 'flex-0 w-[20px] md:w-[30px] rounded-full bg-[#4766EA] p-1',
      linkPoolAddress:
        'https://app.citadao.io/properties/0xa1e567790dd08c0d91c6522744715c4a4971233c',
      poolAddress: '0xa1e...233c',
      priceDif: -5.2,
      valueAmount: '635,000',
      chartData: [
        20, 25, 29, 32, 40, 49, 55, 59, 63, 56, 65, 55, 48, 39, 41, 46, 52, 55,
        58, 54, 50, 48, 40, 46, 45, 48, 53, 58, 62, 67, 69, 69, 65, 70, 72, 65,
      ],
    },
    {
      title: 'PARCL-XFI Pool',
      desc: 'USA market exposure',
      type: 'Real State',
      imgSource: '/images/explore/real-state-white.svg',
      imgStyle: 'flex-0 w-[20px] md:w-[30px] rounded-full bg-[#4766EA] p-1',
      linkPoolAddress:
        'https://app.citadao.io/properties/0xa1e567790dd08c0d91c6522744715c4a4971233c',
      poolAddress: '0xa1e...233c',
      priceDif: 3.1,
      valueAmount: '235,000',
      chartData: [
        50, 45, 40, 42, 40, 49, 55, 59, 63, 63, 65, 59, 55, 50, 48, 46, 52, 63,
        58, 54, 50, 48, 42, 46, 44, 48, 53, 58, 62, 67, 68, 69, 65, 70, 72, 78,
      ],
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
      <section className="relative z-10 h-full overflow-hidden  pb-10 pt-24 lg:pt-40">
        <div className="absolute -right-44 -top-64 z-[-1] rotate-12 opacity-55">
          <img src="/images/video/shape.svg" alt="shape" className="w-full" />
        </div>
        <div className="mx-auto mb-10 flex w-[1000px] items-center gap-x-5 text-2xl text-white md:text-4xl">
          <div className="">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              className="fill-[#4766EA]"
            >
              <path
                opacity="0.5"
                d="M20 30C22.75 30 25 32.25 25 35C25 37.75 22.75 40 20 40C17.25 40 15 37.75 15 35C15 32.25 17.25 30 20 30ZM35 30C37.75 30 40 32.25 40 35C40 37.75 37.75 40 35 40C32.25 40 30 37.75 30 35C30 32.25 32.25 30 35 30ZM35 15C37.75 15 40 17.25 40 20C40 22.75 37.75 25 35 25C32.25 25 30 22.75 30 20C30 17.25 32.25 15 35 15Z"
              />
              <path d="M20 15C22.75 15 25 17.25 25 20C25 22.75 22.75 25 20 25C17.25 25 15 22.75 15 20C15 17.25 17.25 15 20 15ZM20 0C22.75 0 25 2.25 25 5C25 7.75 22.75 10 20 10C17.25 10 15 7.75 15 5C15 2.25 17.25 0 20 0ZM5 30C7.75 30 10 32.25 10 35C10 37.75 7.75 40 5 40C2.25 40 0 37.75 0 35C0 32.25 2.25 30 5 30ZM5 15C7.75 15 10 17.25 10 20C10 22.75 7.75 25 5 25C2.25 25 0 22.75 0 20C0 17.25 2.25 15 5 15ZM5 0C7.75 0 10 2.25 10 5C10 7.75 7.75 10 5 10C2.25 10 0 7.75 0 5C0 2.25 2.25 0 5 0ZM35 0C37.75 0 40 2.25 40 5C40 7.75 37.75 10 35 10C32.25 10 30 7.75 30 5C30 2.25 32.25 0 35 0Z" />
            </svg>
          </div>
          <div>Trending assets</div>
        </div>
        <div className="grid gap-y-7 md:grid-cols-2 md:gap-y-10">
          {trendingAssets.map((option, index) => (
            <div key={index}>
              <div className="mx-auto w-fit cursor-pointer rounded-md px-3 py-1 hover:bg-[#1d1f23b6] md:py-4">
                <div className="w-[250px] md:w-[500px]">
                  <Sparklines
                    data={option?.chartData}
                    width={400}
                    max={100}
                    min={0}
                    height={100}
                  >
                    <SparklinesLine
                      style={{
                        strokeWidth: 2,
                        stroke: option?.priceDif > 0 ? '#6FD572' : '#FE886D',
                        fill: option?.priceDif > 0 ? '#89d38a9d' : '#FE886D',
                      }}
                    />
                  </Sparklines>
                </div>

                <div className="mt-4 items-center  md:flex">
                  <div className="flex items-center gap-x-4">
                    <img
                      alt="image"
                      src={option?.imgSource}
                      className={option?.imgStyle}
                    ></img>
                    <div>
                      <div className="text-base text-white md:text-lg">
                        {option.title}
                      </div>
                      <div className="text-xs text-[#adadae] md:text-sm">
                        {option.type}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-y-2 md:ml-10 md:mt-0">
                    <div className=" text-sm text-[#adadae]">
                      {option?.desc}
                    </div>
                    <div className=" flex items-center gap-x-2 text-sm text-[#adadae]">
                      <img
                        alt="image"
                        src="/images/workspace/crossfi.png"
                        className="flex-0 w-[20px]"
                      ></img>
                      <div>
                        Pool address:{' '}
                        <a
                          href={option?.linkPoolAddress}
                          target="_blank"
                          className="text-[#4766EA] underline"
                          rel="noreferrer"
                        >
                          {option?.poolAddress}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-x-3 gap-y-1 md:ml-10 md:mt-0 md:grid md:gap-x-0">
                    <div className="flex items-center gap-x-2 font-medium md:ml-auto">
                      <div
                        className={`${
                          option?.priceDif > 0
                            ? 'rotate-45  font-bold text-[#6FD572]'
                            : '-rotate-45 font-bold text-[#FE886D]'
                        }`}
                      >
                        {option?.priceDif > 0 ? '↑' : '↓'}
                      </div>
                      <div
                        className={`text-sm ${
                          option?.priceDif > 0
                            ? 'text-[#6FD572]'
                            : 'text-[#FE886D]'
                        }`}
                      >
                        {option?.priceDif}%
                      </div>
                    </div>
                    <div className="text-sm text-white">
                      ${option?.valueAmount}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default Trending
