/* eslint-disable @next/next/no-img-element */
'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import ThemeToggler from './ThemeToggler'
import menuData from './menuData'
import SubHeader from './SubHeader'
import ConnectButton from '@/contexts/ConnectButton'
import { useAccount } from 'wagmi'
import { useAcoUtils } from '../Hooks/useAcoUtils'
import { AccountContext } from '@/contexts/AccountContext'

const Header = () => {
  const pathName = usePathname()
  const { address, chain } = useAccount()
  const { checkAndSetAcoUserExists } = useAcoUtils()
  const [acoUserExist, setAcoUserExist] = useState<boolean>(true)
  const { push } = useRouter()

  const { acoUser, setAcoUser } = useContext(AccountContext)

  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false)
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen)
  }

  // Sticky Navbar
  const [sticky, setSticky] = useState(false)
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true)
    } else {
      setSticky(false)
    }
  }
  useEffect(() => {
    window.addEventListener('scroll', handleStickyNavbar)
  })

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1)
  const handleSubmenu = (index) => {
    if (openIndex === index) {
      setOpenIndex(-1)
    } else {
      setOpenIndex(index)
    }
  }

  async function getAcoUser(address: string) {
    const userExists = await checkAndSetAcoUserExists(address)
    if (userExists) {
      setAcoUser({ address })
    }
  }

  useEffect(() => {
    if (address) {
      getAcoUser(address)
    }
  }, [address])

  return (
    <>
      <header
        className={`header left-0 top-0 z-40 flex w-full items-center bg-transparent bg-gradient-to-b from-[#222529] to-[#1a1d20] py-3 md:py-0 ${
          !sticky
            ? '!fixed !z-[9999] !bg-white !bg-opacity-80 shadow-sticky backdrop-blur-sm !transition dark:!bg-opacity-100'
            : '!fixed !z-[9999] !bg-white !bg-opacity-80 shadow-sticky backdrop-blur-sm !transition dark:!bg-opacity-60'
        }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-40 max-w-full px-4 xl:mr-12">
              <Link
                href="/"
                className={`header-logo block w-full ${
                  sticky ? 'py-2 lg:py-1' : 'py-1'
                } `}
              >
                <Image
                  onClick={() => {
                    console.log(pathName)
                  }}
                  src="/images/logo.svg"
                  alt="logo"
                  width={100}
                  height={10}
                  className="hidden w-full dark:block"
                />
              </Link>
            </div>
            <div className="flex w-full items-center justify-between px-4">
              <div>
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="absolute right-4 top-1/2 block translate-y-[-50%] rounded-lg px-3 py-[6px] ring-primary focus:ring-2 md:hidden"
                >
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? ' top-[7px] rotate-45' : ' '
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? 'opacity-0 ' : ' '
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? ' top-[-8px] -rotate-45' : ' '
                    }`}
                  />
                </button>
                <nav
                  id="navbarCollapse"
                  className={`navbar absolute right-0 z-30 w-[250px] -translate-x-2 translate-y-5 rounded border-[.5px] border-body-color/50 bg-white px-6 py-4 duration-300 dark:border-body-color/20 dark:bg-dark md:-translate-x-0 md:translate-y-0 lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                    navbarOpen
                      ? 'visibility top-full opacity-100'
                      : 'invisible top-[120%] opacity-0'
                  }`}
                >
                  <ul className="block lg:flex lg:space-x-12">
                    {menuData.map((menuItem, index) => (
                      <li key={menuItem.id} className="group relative">
                        {menuItem.path ? (
                          <Link
                            href={menuItem.path}
                            onClick={() => {
                              push(menuItem.path)
                            }} // Adicione isso
                            className={`${
                              menuItem.path?.length > 1 &&
                              pathName.includes(menuItem.path)
                                ? 'border-b-[1px] border-[#fff] !text-white'
                                : ''
                            } ${
                              pathName?.length <= 1 &&
                              pathName.includes(menuItem.path)
                                ? 'border-b-[1px] border-[#fff] !text-white'
                                : ''
                            } flex py-2 text-base text-dark group-hover:border-b-[1px] group-hover:border-[#adadae] dark:text-[#adadae] lg:mr-0 lg:inline-flex lg:px-0 lg:py-6`}
                          >
                            {menuItem.title}
                          </Link>
                        ) : (
                          <>
                            <a
                              onClick={() => handleSubmenu(index)}
                              className="flex cursor-pointer items-center justify-between py-2 text-base text-dark group-hover:text-[#3A51B0] dark:text-white lg:mr-0 lg:inline-flex lg:px-0 lg:py-6"
                            >
                              {menuItem.title}
                              <span className="pl-3">
                                <svg width="15" height="14" viewBox="0 0 15 14">
                                  <path
                                    d="M7.81602 9.97495C7.68477 9.97495 7.57539 9.9312 7.46602 9.8437L2.43477 4.89995C2.23789 4.70308 2.23789 4.39683 2.43477 4.19995C2.63164 4.00308 2.93789 4.00308 3.13477 4.19995L7.81602 8.77183L12.4973 4.1562C12.6941 3.95933 13.0004 3.95933 13.1973 4.1562C13.3941 4.35308 13.3941 4.65933 13.1973 4.8562L8.16601 9.79995C8.05664 9.90933 7.94727 9.97495 7.81602 9.97495Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </span>
                            </a>
                            <div
                              className={`submenu relative left-0 top-full rounded-md bg-white transition-[top] duration-300 group-hover:opacity-100 dark:bg-dark lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[250px] lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full ${
                                openIndex === index ? 'block' : 'hidden'
                              }`}
                            >
                              {menuItem.submenu.map((submenuItem) => (
                                <Link
                                  href={submenuItem.path}
                                  key={submenuItem.id}
                                  className="block rounded py-2.5 text-sm text-dark hover:text-[#3A51B0] dark:text-white lg:px-3"
                                >
                                  {submenuItem.title}
                                </Link>
                              ))}
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="mx-auto mt-3 flex md:hidden">
                    <ConnectButton />
                  </div>
                </nav>
              </div>
              <div className="flex items-center justify-end pr-16 lg:pr-0">
                {/* <div className="cursor-pointer rounded-md bg-[#4766EA] px-5 py-1 text-white hover:bg-[#3A51B0]">
                  Connect wallet
                </div> */}
                {address && !acoUserExist && (
                  <div className="flex cursor-pointer items-center gap-x-1 rounded-md border-[1px] border-[#d84c4c] px-2 py-1 hover:bg-[#2a2a2cb7]">
                    <img
                      alt="img"
                      src="/images/attention.svg"
                      className="w-[13px]"
                    ></img>
                    <div className=" text-sm text-red">Create user</div>
                  </div>
                )}
                <div className="mx-auto hidden md:flex">
                  <ConnectButton />
                </div>
                {/* <div>
                  <ThemeToggler />
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </header>
      <SubHeader />
    </>
  )
}

export default Header
