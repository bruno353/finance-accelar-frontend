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
      logoSource: '/images/explore/g-bert.png',
      logoStyle: 'w-10 rounded-full',
      description:
        'This repository contains the necessary files to deploy a Flask application that uses the BERT language model on the Akash network. BERT is a powerful language model that can understand and generate text in English.',
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
        'Falcon-7B-Instruct is a 7B parameters causal decoder-only model built by TII based on Falcon-7B and finetuned on a mixture of chat/instruct datasets. It is made available under the Apache 2.0 license.',
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
      description: 'Deploy a set of the cosmos chain.',
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
        'The easiest way to install and use Stable Diffusion on your computer. Does not require technical knowledge, does not require pre-installed software. 1-click install, powerful features, friendly community.',
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
      <section className="relative z-10 h-full overflow-hidden  pb-5 pt-2 lg:pt-20">
        <div className="mx-auto flex w-fit items-center justify-center gap-x-10">
          <img
            alt="image"
            src="/images/explore/arrow.svg"
            className={`w-5 rotate-180 cursor-pointer ${isStart && 'hidden'}`}
            onClick={() => mySwiper.slidePrev()}
          />
          <div className="mx-auto max-w-[900px]">
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
              spaceBetween={5}
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              className="mySwiper"
            >
              {feats.map((feat, index) => (
                <SwiperSlide key={index} className="flex justify-center">
                  <div
                    className={`relative h-[400px] w-[260px] rounded-lg border-[1px] border-[#24262a] bg-[#1D1F23] px-5 py-4 text-base text-white hover:bg-[#25282C]`}
                  >
                    <img
                      alt="image"
                      src="/images/explore/akash.svg"
                      className="absolute right-2 top-2 w-[15px]"
                    />
                    <div className="flex justify-between">
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
                    <div className="mt-2 grid gap-y-4">
                      <div className="flex items-end gap-x-2">
                        <img
                          alt="image"
                          src="/images/explore/gpu.svg"
                          className="w-5"
                        />
                        <div>Gpu:</div>
                        <div>{feat.gpu}</div>
                      </div>
                      <div className="flex items-end gap-x-2">
                        <img
                          alt="image"
                          src="/images/explore/cpu.svg"
                          className="w-5"
                        />
                        <div>Cpu:</div>
                        <div>{feat.cpu}</div>
                      </div>
                      <div className="flex items-end gap-x-2">
                        <img
                          alt="image"
                          src="/images/explore/memory.svg"
                          className="w-5"
                        />
                        <div>Memory size:</div>
                        <div>{feat.memorySize}</div>
                      </div>
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
