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

  useEffect(() => {
    if (mySwiper?.isBeginning) {
      setIsStart(true)
    } else {
      setIsStart(false)
    }
  }, [mySwiper])

  return (
    <>
      <section className="relative z-10 h-full overflow-hidden  pb-10 pt-2 lg:pt-40">
        <div className="mx-auto flex w-[1000px] items-center gap-x-5 text-4xl text-white">
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
        <div className="gapy-10 grid">
          <div className="cursor-pointer rounded-md px-3 py-4 hover:bg-[#1D1F23] w-fit mx-auto">
            <div className='w-[500px]'>
            <Sparklines
              data={[50, 52, 54, 58, 60, 59, 59, 53, 51, 50, 55, 59, 64, 65, 68, 72, 67, 62, 58, 54, 55, 52, 50, 46, 45, 48, 53, 58, 62, 67, 69, 69, 65, 72, 80, 85]}
              width={400}
              max={100}
              min={0}
              height={100}
            >
              <SparklinesLine
                style={{
                  strokeWidth: 2,
                  stroke: '#6FD572',
                  fill: '#89d38a9d',
                }}
              />
            </Sparklines>
            </div>

            <div className='flex items-center'>
        <div className="flex items-center gap-x-4 mt-4">
            <img
              alt="image"
              src="/images/explore/bank-white.svg"
              className="flex-0 w-[30px] rounded-full bg-[#4766EA] p-1"
            ></img>
            <div>
              <div className='text-white text-lg'>CLP-XFI Pool</div>
              <div className='text-[#adadae] text-sm'>Credit</div>
            </div>
          </div>
          <div className='ml-10 text-[#adadae] text-sm'>
            APR: 17.85%
             

          </div>
        </div>
          
        </div>
        </div>

      </section>
    </>
  )
}

export default Trending
