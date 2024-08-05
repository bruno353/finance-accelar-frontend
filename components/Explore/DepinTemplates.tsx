/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unknown-property */
/* eslint-disable dot-notation */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
'use client'
// import { useState } from 'react'
import { useEffect, useState, ChangeEvent, FC, useContext } from 'react'
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
import { Sparklines, SparklinesLine } from 'react-sparklines'

import { createHash } from 'crypto'
import ScrollToTop from '../ScrollToTop/index'
import { SigninForm, SignupForm } from '@/types/user'
import { createUser, googleRedirect, loginUser } from '@/utils/api'

const DepinTemplates = () => {
  const [animate, setAnimate] = useState<boolean>(true)

  const { push } = useRouter()

  const feats = [
    {
      title: 'BERT',
      description:
        'This repository contains the necessary files to deploy a Flask application that uses the BERT language model on the Akash network. BERT is a powerful language model that can understand and generate text in English.',
      dockerImage: 'clydedevv/bert-base-uncased:0.0.8',
      cpu: '4',
      memorySize: '4Gi',
      gpu: 'Nvidia v100 - 1',
      price: 'U$ 370,56 / month',
      imgSource: '/images/explore/cloud.svg',
      imgStyle: 'w-6',
      active: true,
    },
    {
      title: 'Minecraft',
      description:
        'Launch a Minecraft server on the Akash blockchain. It can be easily configured with only changes to deploy.yaml, and supports any Minecraft version, including multiple modded server types.',
      dockerImage: 'itzg/minecraft-server',
      cpu: '2',
      memorySize: '5Gi',
      price: 'U$ 5,28 / month',
      imgSource: '/images/explore/cloud.svg',
      imgStyle: 'w-6',
      active: true,
    },
    {
      title: 'Falcon-7B',
      description:
        'Falcon-7B-Instruct is a 7B parameters causal decoder-only model built by TII based on Falcon-7B and finetuned on a mixture of chat/instruct datasets. It is made available under the Apache 2.0 license.',
      dockerImage: 'andrey01/falcon7b:0.4',
      cpu: '8',
      memorySize: '100Gi',
      gpu: 'Nvidia a100 - 1',
      price: 'U$ 510,20 / month',
      imgSource: '/images/explore/cloud.svg',
      imgStyle: 'w-6',
      active: true,
    },
    {
      title: 'Cosmos Hub',
      description: 'Deploy a set of the cosmos chain.',
      dockerImage:
        'ghcr.io/akash-network/cosmos-omnibus:v0.4.23-cosmoshub-v18.1.0',
      cpu: '4',
      memorySize: '100Gi',
      price: 'U$ 11,89 / month',
      imgSource: '/images/explore/cloud.svg',
      imgStyle: 'w-6',
      active: true,
    },
    {
      title: 'Stable Diffusion',
      description:
        'The easiest way to install and use Stable Diffusion on your computer. Does not require technical knowledge, does not require pre-installed software. 1-click install, powerful features, friendly community.',
      dockerImage: 'ghcr.io/spacepotahto/qbittorrent:1.0.0',
      cpu: '16',
      memorySize: '32Gi',
      gpu: 'Nvidia rtx4090 - 1',
      price: 'U$ 341,06 / month',
      imgSource: '/images/explore/cloud.svg',
      imgStyle: 'w-6',
      active: true,
    },
  ]

  return (
    <>
      <section className="relative z-10 h-full overflow-hidden  pb-5 pt-2 lg:pt-20">
        <div className="absolute -right-44 bottom-0 z-[-1] rotate-45">
          <img src="/images/video/shape.svg" alt="shape" className="w-full" />
        </div>
        <div className="container">
          <div className="text-white">
            <div className="pt-10 text-4xl font-semibold">
              Multi-chain aggregational protocol for Crossfi
            </div>
            <div className="max-w-[500px] pt-2">
              In a seemsly way, buy baskets options, deploy DePin capabilities,
              trade Real state prices and more!
            </div>
          </div>
          <div className="mt-[100px] inline-flex w-full flex-nowrap gap-x-[20px] [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
            <ul
              className={`flex animate-infinite-scroll  ${
                animate ? '' : '[animation-play-state:paused]'
              } gap-x-[20px]`}
            >
              {stocks?.map((option, index) => (
                <li
                  onMouseEnter={() => {
                    setAnimate(false)
                  }}
                  onMouseLeave={() => {
                    setAnimate(true)
                  }}
                  key={index}
                  className="relative h-fit w-full cursor-pointer rounded-lg px-5 py-4 text-base text-white hover:bg-[#25282C]"
                >
                  <div className="flex flex-nowrap items-center gap-x-3">
                    <div>
                      <img
                        alt="image"
                        src={stockToImg[option?.type]?.imgSource}
                        className={stockToImg[option?.type]?.imgStyle}
                      ></img>
                    </div>
                    <div className="grid">
                      <div className="w-full flex-nowrap whitespace-nowrap text-sm font-medium">
                        {option.title}
                      </div>
                      <div className="flex items-center gap-x-2">
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
                    </div>
                    <div className="w-16">
                      <Sparklines
                        data={option?.priceArray}
                        width={100}
                        height={40}
                      >
                        <SparklinesLine
                          style={{
                            strokeWidth: 3,
                            stroke:
                              option?.priceDif > 0 ? '#6FD572' : '#FE886D',
                            fill: 'none',
                          }}
                        />
                      </Sparklines>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <ul
              x-ref="logos"
              className={`flex animate-infinite-scroll ${
                animate ? '' : '[animation-play-state:paused]'
              } gap-x-[20px]`}
            >
              {stocks?.map((option, index) => (
                <li
                  onMouseEnter={() => {
                    setAnimate(false)
                  }}
                  onMouseLeave={() => {
                    setAnimate(true)
                  }}
                  key={index}
                  className="relative h-fit w-full cursor-pointer rounded-lg px-5 py-4 text-base text-white hover:bg-[#25282C]"
                >
                  <div className="flex flex-nowrap items-center gap-x-3">
                    <div>
                      <img
                        alt="image"
                        src={stockToImg[option?.type]?.imgSource}
                        className={stockToImg[option?.type]?.imgStyle}
                      ></img>
                    </div>
                    <div className="grid">
                      <div className="w-full flex-nowrap whitespace-nowrap text-sm font-medium">
                        {option.title}
                      </div>
                      <div className="flex items-center gap-x-2">
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
                    </div>
                    <div className="w-16">
                      <Sparklines
                        data={option?.priceArray}
                        width={100}
                        height={40}
                      >
                        <SparklinesLine
                          style={{
                            strokeWidth: 3,
                            stroke:
                              option?.priceDif > 0 ? '#6FD572' : '#FE886D',
                            fill: 'none',
                          }}
                        />
                      </Sparklines>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-20 flex">
            <ul className="mx-auto flex gap-x-20">
              {feats.map((option, index) => (
                <li
                  key={index}
                  className={`relative h-36 w-56 ${
                    option?.active
                      ? 'cursor-pointer border-[#6fd572c0] shadow-sm shadow-[#6fd572c0]'
                      : 'border-[#24262a]'
                  }  rounded-lg border-[1px]  bg-[#1D1F23] px-5 py-4 text-base text-white hover:bg-[#25282C]`}
                >
                  <div className="absolute bottom-4 mt-auto max-w-[70%]">
                    <img
                      alt="image"
                      src={option?.imgSource}
                      className={option?.imgStyle}
                    ></img>
                    <div className="mb-1 mt-4 font-medium">{option?.title}</div>
                    <div className="text-sm leading-tight text-[#adadae]">
                      {option?.description}
                    </div>
                  </div>
                  {option?.active ? (
                    <div className="absolute right-2 top-2 h-2 w-2 animate-pulse rounded-full bg-[#6FD572]"></div>
                  ) : (
                    <div className="absolute right-2 top-2 text-sm text-[#adadae]">
                      Soon
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}

export default DepinTemplates
