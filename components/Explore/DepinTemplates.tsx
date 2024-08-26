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

const DepinTemplates = () => {
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

  useEffect(() => {
    if (mySwiper?.isBeginning) {
      setIsStart(true)
    } else {
      setIsStart(false)
    }
  }, [mySwiper])

  return (
    <>
      <section className="relative z-10 h-full overflow-hidden  pb-5 pt-28 lg:pt-44">
        <div className="absolute -right-44 top-20 z-[-1] rotate-180 opacity-20">
          <img src="/images/video/shape.svg" alt="shape" className="w-full" />
        </div>
        <div className="mx-auto flex w-[1000px] items-center gap-x-5 text-2xl text-white  md:text-4xl">
          <div>
            <svg
              width="69"
              height="84"
              viewBox="0 0 79 94"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                opacity="0.3"
                x="-41"
                y="26.9426"
                width="66.6675"
                height="66.6675"
                transform="rotate(-22.9007 -41 26.9426)"
                fill="url(#paint0_linear_94:889)"
              />
              <rect
                x="-41"
                y="26.9426"
                width="66.6675"
                height="66.6675"
                transform="rotate(-22.9007 -41 26.9426)"
                stroke="url(#paint1_linear_94:889)"
                strokeWidth="0.7"
              />
              <path
                opacity="0.3"
                d="M50.5215 7.42229L20.325 1.14771L46.2077 62.3249L77.1885 68.2073L50.5215 7.42229Z"
                fill="url(#paint2_linear_94:889)"
              />
              <path
                d="M50.5215 7.42229L20.325 1.14771L46.2077 62.3249L76.7963 68.2073L50.5215 7.42229Z"
                stroke="url(#paint3_linear_94:889)"
                strokeWidth="0.7"
              />
              <path
                opacity="0.3"
                d="M17.9721 93.3057L-14.9695 88.2076L46.2077 62.325L77.1885 68.2074L17.9721 93.3057Z"
                fill="url(#paint4_linear_94:889)"
              />
              <path
                d="M17.972 93.3057L-14.1852 88.2076L46.2077 62.325L77.1884 68.2074L17.972 93.3057Z"
                stroke="url(#paint5_linear_94:889)"
                strokeWidth="0.7"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_94:889"
                  x1="-41"
                  y1="21.8445"
                  x2="36.9671"
                  y2="59.8878"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" stopOpacity="0.62" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_94:889"
                  x1="25.6675"
                  y1="95.9631"
                  x2="-42.9608"
                  y2="20.668"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" stopOpacity="0" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.51" />
                </linearGradient>
                <linearGradient
                  id="paint2_linear_94:889"
                  x1="20.325"
                  y1="-3.98039"
                  x2="90.6248"
                  y2="25.1062"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" stopOpacity="0.62" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id="paint3_linear_94:889"
                  x1="18.3642"
                  y1="-1.59742"
                  x2="113.9"
                  y2="80.6826"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" stopOpacity="0" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.51" />
                </linearGradient>
                <linearGradient
                  id="paint4_linear_94:889"
                  x1="61.1098"
                  y1="62.3249"
                  x2="-8.82468"
                  y2="58.2156"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" stopOpacity="0.62" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id="paint5_linear_94:889"
                  x1="65.4236"
                  y1="65.0701"
                  x2="24.0178"
                  y2="41.6598"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" stopOpacity="0" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.51" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="">Depin Templates</div>
        </div>
        <div className="mx-auto flex w-fit items-center justify-center gap-x-10">
          <img
            alt="image"
            src="/images/explore/arrow.svg"
            className={`w-5 rotate-180 cursor-pointer ${isStart && 'hidden'}`}
            onClick={() => mySwiper.slidePrev()}
          />
          <div className="mx-auto max-w-[800px] md:max-w-[1000px]">
            <Swiper
              ref={swiperRef}
              onInit={(ev) => {
                setMySwiper(ev)
              }}
              onSlideChange={(swiper) => {
                if (swiper?.isBeginning) {
                  setIsStart(true)
                } else {
                  setIsStart(false)
                }
                if (swiper?.isEnd) {
                  setIsEnd(true)
                } else {
                  setIsEnd(false)
                }
              }}
              slidesPerView={3}
              spaceBetween={25}
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              className="mySwiper"
            >
              {feats.map((feat, index) => (
                <SwiperSlide key={index} className="flex justify-center py-5">
                  <div
                    className={`relative h-[400px] w-[230px] cursor-pointer rounded-lg  border-[1px] border-[#24262a]  bg-[#1D1F23] px-5 py-4 text-base text-white transition-transform duration-300 hover:scale-105 hover:bg-[#25282C] md:h-[400px] md:w-[280px]`}
                  >
                    <img
                      alt="image"
                      src="/images/explore/akash.svg"
                      className="absolute right-2 top-2 w-[15px]"
                    />
                    <div className="flex items-end justify-between">
                      <img
                        alt="image"
                        src={feat.logoSource}
                        className={feat.logoStyle}
                      />
                      <div className="text-sm text-[#adadae]">{feat.price}</div>
                    </div>
                    <div className="mb-1 mt-4 font-medium">{feat.title}</div>
                    <div className="text-sm leading-tight text-[#adadae]">
                      {feat.description}
                    </div>
                    <div className="mt-3 grid gap-y-4 text-sm">
                      {feat.gpu?.length > 0 && (
                        <div className="flex items-center gap-x-2">
                          <img
                            alt="image"
                            src="/images/explore/gpu.svg"
                            className="w-5"
                          />
                          <div>Gpu:</div>
                          <div>{feat.gpu}</div>
                        </div>
                      )}
                      <div className="flex items-center gap-x-2">
                        <img
                          alt="image"
                          src="/images/explore/cpu.svg"
                          className="w-5"
                        />
                        <div>Cpu:</div>
                        <div>{feat.cpu}</div>
                      </div>
                      <div className="flex items-center gap-x-2">
                        <img
                          alt="image"
                          src="/images/explore/memory.svg"
                          className="w-4"
                        />
                        <div>Memory size:</div>
                        <div>{feat.memorySize}</div>
                      </div>
                    </div>
                    <div className="">
                      <a href="/feats/depin">
                        <div className="absolute bottom-6 left-0 right-0 mx-auto w-fit rounded-md border-[1px] border-[#4766EA] bg-transparent px-4 py-[1px] text-[14px] text-[#4766EA] hover:bg-[#3a52b05f]">
                          Deploy model
                        </div>
                      </a>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <img
            alt="image"
            src="/images/explore/arrow.svg"
            className={`w-5 cursor-pointer ${isEnd && 'hidden'}`}
            onClick={() => mySwiper.slideNext()}
          />
        </div>
      </section>
    </>
  )
}

export default DepinTemplates
