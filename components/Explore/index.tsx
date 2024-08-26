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
import DepinTemplates from './DepinTemplates'
import Trending from './Trending'
import Docs from './Docs'
import Footer from '../Footer'

const Explore = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(true)
  const [animate, setAnimate] = useState<boolean>(true)

  const { push } = useRouter()

  const feats = [
    {
      title: 'DePin',
      description: 'Cloud computing capabilities on-chain',
      subDescription: '+1000 templates',
      imgSource: '/images/explore/cloud.svg',
      imgStyle: 'w-6',
      active: true,
    },
    {
      title: 'Synthetics',
      description: 'Trade synthetic assets at Crossfi',
      subDescription: '12 assets',
      imgSource: '/images/explore/money.svg',
      imgStyle: 'w-6',
      active: false,
    },
    {
      title: 'Real State',
      description: 'Trade USA real state price movements',
      subDescription: '30 markets',
      imgSource: '/images/explore/real-state.svg',
      imgStyle: 'w-6',
      active: false,
    },
    {
      title: 'Credit',
      description: 'Trade and participate on loans pools',
      subDescription: '23 pools',
      imgSource: '/images/explore/bank.svg',
      imgStyle: 'w-6',
      active: false,
    },
  ]

  const stockToImg = {
    DePin: {
      imgSource: '/images/explore/cloud-white.svg',
      imgStyle: 'w-[30px] p-1 bg-[#4766EA] rounded-full flex-0',
    },
    Synthetic: {
      imgSource: '/images/explore/money-white.svg',
      imgStyle: 'w-[30px] p-1 bg-[#4766EA] rounded-full flex-0',
    },
    'Real State': {
      imgSource: '/images/explore/real-state-white.svg',
      imgStyle: 'w-[30px] p-1 bg-[#4766EA] rounded-full flex-0',
    },
    Credit: {
      imgSource: '/images/explore/bank.svg',
      imgStyle: 'w-[30px] p-1 bg-[#4766EA] rounded-full flex-0',
    },
  }

  const stocks = [
    {
      title: 'GPU H100',
      type: 'DePin',
      priceDif: -20,
      priceArray: [5, 10, 5, 20, 25, 18, 12, 5, 1, 20, 30, 50, 10, 15, 0],
    },
    {
      title: 'Gold',
      type: 'Synthetic',
      priceDif: 22,
      priceArray: [5, 10, 5, 15, 25, 2, 30, 5, 20, 60, 30, 50, 20, 15, 50],
    },
    {
      title: 'GPU A100',
      type: 'DePin',
      priceDif: 10,
      priceArray: [5, 10, 5, 20, 25, 18, 12, 5, 12, 20, 30, 50, 20, 15, 25],
    },
    {
      title: 'Los Angeles',
      type: 'Real State',
      priceDif: -8,
      priceArray: [5, 10, 5, 15, 10, 2, 30, 5, 20, 60, 10, 50, 20, 40, 10],
    },
    {
      title: 'GPU RTX 4090',
      type: 'DePin',
      priceDif: -6,
      priceArray: [5, 10, 5, 5, 25, 18, 6, 5, 12, 20, 30, 50, 5, 15, 3],
    },
    {
      title: 'GPU RTX 3090',
      type: 'DePin',
      priceDif: 13,
      priceArray: [5, 10, 5, 15, 25, 2, 12, 5, 12, 20, 30, 50, 20, 15, 50],
    },
  ]

  return (
    <>
      <section className="relative z-10 h-full overflow-hidden  pb-5 pt-2 lg:pt-20">
        <div className="absolute -right-44 top-0 z-[-1] rotate-45">
          <img src="/images/video/shape.svg" alt="shape" className="w-full" />
        </div>
        <div className="container">
          <div className="text-white">
            <div className="pt-16 text-4xl font-semibold">
              Multi-chain aggregational protocol for Core DAO
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
            <ul className="mx-auto grid gap-x-20 gap-y-8 md:flex">
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
          <DepinTemplates />
          <Trending />
          <Docs />
        </div>
      </section>
      <Footer />
    </>
  )
}

export default Explore
