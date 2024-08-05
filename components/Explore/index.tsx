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

import { createHash } from 'crypto'
import ScrollToTop from '../ScrollToTop/index'
import { SigninForm, SignupForm } from '@/types/user'
import { createUser, googleRedirect, loginUser } from '@/utils/api'

const Explore = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(true)

  const { push } = useRouter()

  const { user, setUser } = useContext(AccountContext)

  const validSchema = Yup.object().shape({
    email: Yup.string().max(500).required('Email is required'),
    password: Yup.string().max(500).required('Password is required'),
  })
  const {
    register,
    handleSubmit,
    setValue,
    control, // Adicione esta linha
    // eslint-disable-next-line no-unused-vars
    reset,
    formState: { errors },
  } = useForm<SigninForm>({
    resolver: yupResolver<any>(validSchema),
  })

  async function onSubmit(data: SigninForm) {
    console.log('oiii')
    setIsLoading(true)

    try {
      const res = await loginUser(data)
      setCookie(null, 'userSessionToken', res.sessionToken, {
        path: '/',
        maxAge: 30 * 24 * 60 * 60, // Exemplo de validade do cookie: 30 dias
        secure: true, // Recomendado para produção, garante que o cookie seja enviado apenas por HTTPS
        sameSite: 'strict', // Recomendado para evitar ataques de CSRF
      })
      setCookie(null, 'user', JSON.stringify(res), {
        path: '/',
        maxAge: 30 * 24 * 60 * 60, // Exemplo de validade do cookie: 30 dias
        secure: true, // Recomendado para produção, garante que o cookie seja enviado apenas por HTTPS
        sameSite: 'strict', // Recomendado para evitar ataques de CSRF
      })
      setUser(res)
      setIsLoading(false)
      push('/dashboard')
    } catch (err) {
      console.log(err)
      toast.error(`Error: ${err.response.data.message}`)
      setIsLoading(false)
    }
  }

  async function handleLoginGoogle(url: string) {
    setIsLoading(true)
    try {
      const user = await googleRedirect(url)
      if (user) {
        setCookie(null, 'userSessionToken', user['sessionToken'], {
          path: '/',
          maxAge: 30 * 24 * 60 * 60, // Exemplo de validade do cookie: 30 dias
          secure: true, // Recomendado para produção, garante que o cookie seja enviado apenas por HTTPS
          sameSite: 'strict', // Recomendado para evitar ataques de CSRF
        })
        setCookie(null, 'user', JSON.stringify(user), {
          path: '/',
          maxAge: 30 * 24 * 60 * 60, // Exemplo de validade do cookie: 30 dias
          secure: true, // Recomendado para produção, garante que o cookie seja enviado apenas por HTTPS
          sameSite: 'strict', // Recomendado para evitar ataques de CSRF
        })
        setUser(user)
        push('/dashboard')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const feats = [
    {
      title: 'DePin',
      description: 'Cloud computing capabilities on-chain',
      subDescription: '+1000 templates',
    },
  ]

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    if (code) {
      const url = window.location.href
      const loginIndex = url.indexOf('signin')
      console.log('getting length after login')
      const afterLogin = url.substring(loginIndex + 'signin'.length)

      console.log(afterLogin)
      handleLoginGoogle(afterLogin)
    }
  }, [])

  return (
    <>
      <section className="relative z-10 h-full overflow-hidden  pt-2 lg:pt-20">
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
          <div className='mt-[200px]'>
            Hello
          </div>
        </div>
      </section>
    </>
  )
}

export default Explore
