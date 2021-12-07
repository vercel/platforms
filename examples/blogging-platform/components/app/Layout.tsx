import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import {useRouter} from 'next/router'
import React, {useState} from 'react'
import { signOut } from 'next-auth/client'
import Loader from '../Loader'
import useRequireAuth from '../../lib/useRequireAuth'
import { ChevronDownIcon } from '@heroicons/react/outline'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Layout ({children}) {

    const title = 'Platforms on Vercel'
    const description = 'Create a fullstack application with multi-tenancy and custom domains support using Next.js, Prisma, and PostgreSQL'
    const logo = '/favicon.ico'
    const router = useRouter()
    const [dropdown, setDropdown] = useState(false)

    const session = useRequireAuth()
    if (!session) return <Loader />

  return (
    <>
    <div>  
      <Head>
        <title>{title}</title>
        <link rel="icon" href={logo} />
        <link rel="shortcut icon" type="image/x-icon" href={logo}/>
        <link rel="apple-touch-icon" sizes="180x180" href={logo}/>
        <meta name="theme-color" content="#7b46f6"/>

        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>

        <meta itemProp="name" content={title}/>
        <meta itemProp="description" content={description}/>
        <meta itemProp="image" content={logo}/>
        <meta name="description" content={description}/>
        <meta property="og:title" content={title}/>
        <meta property="og:description" content={description}/>
        <meta property="og:image" content={logo}/>
        <meta property="og:type" content="website"/>

        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:site" content="@Elegance" />
        <meta name="twitter:creator" content="@StevenTey"/>
        <meta name="twitter:title" content={title}/>
        <meta name="twitter:description" content={description}/>
        <meta name="twitter:image" content={logo}/>
      </Head>
          <div 
            className={classNames(
              dropdown ? 'h-64 shadow-2xl' : 'h-20',
              'absolute w-full overflow-hidden border-b bg-white border-gray-200 transition-all ease-in-out duration-300 z-20'
            )}
          >
            <div className="absolute mx-auto left-0 right-0 flex justify-between items-center bg-white z-10 w-10/12 lg:w-1/2 py-5 md:space-x-5">
              <div className="flex justify-start w-0 flex-1">
                <Link href="/"><a>
                  {session ? 
                  <div
                    className="h-8 w-auto sm:h-10 inline-block rounded-full overflow-hidden align-middle"
                  >
                    <Image
                      src={session.user.image}
                      width={40}
                      height={40}
                      alt="Profile Picture"
                    />
                  </div>
                  : 
                  <div className="h-8 w-8 sm:h-10 sm:w-10 inline-block rounded-full bg-gray-200 animate-pulse"/>
                  }
                  <span className="inline-block ml-3 text-lg text-gray-700 align-middle truncate">{session ? session.user.name : ''}</span>
                </a></Link>
              </div>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setDropdown(!dropdown)}
                >
                  <ChevronDownIcon
                    className={classNames(
                      dropdown ? 'text-gray-600 transform rotate-180' : 'text-gray-400',
                      'h-8 w-8 group-hover:text-gray-500 transition-all ease duration-200 inline-block align-middle'
                    )}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
            <div
              className={classNames(
                dropdown ? 'translate-y-0' : '-translate-y-48',
                'flex flex-col items-end space-y-5 text-lg text-gray-800 absolute mx-auto left-0 right-0 top-24 w-10/12 sm:w-1/2 transform transition-all ease-in-out duration-300'
              )}
            >
              <Link href="/">
                <a>
                  Sites
                </a>
              </Link>
              <Link href={`/account`}>
                <a>
                  Account
                </a>
              </Link>
              <button onClick={() => signOut()}>
                  Logout
              </button>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden sm:flex justify-between items-center mx-auto w-10/12 sm:w-1/2 py-5 sm:px-6 md:justify-start md:space-x-10">
              <div className="flex justify-start lg:w-0 lg:flex-1">
                <Link href="/"><a>
                  {session ? <img
                    className="h-8 w-auto sm:h-10 inline-block rounded-full"
                    src={session.user.image}
                    alt=""
                  />
                  :
                  <div className="h-8 w-8 sm:h-10 sm:w-10 inline-block rounded-full bg-gray-200 animate-pulse"/>
                  }
                  <span className="inline-block ml-3 text-lg text-gray-700 align-middle truncate">{session ? session.user.name : ''}</span>
                </a></Link>
              </div>
              <div className="flex items-center space-x-10 justify-end flex-1 lg:w-0">
                <Link href="/">
                    <a className={classNames(
                        router.pathname == '/' || router.pathname.split('/')[1] == 'publication' ? 'text-indigo-600' : '',
                        'text-base font-medium text-gray-700 hover:text-indigo-600'
                        )}>
                        Publications
                    </a>
                </Link>
                <Link href={`/account`}>
                    <a className={classNames(
                        router.pathname == '/account' ? 'text-indigo-600' : '',
                        'text-base font-medium text-gray-700 hover:text-indigo-600'
                        )}>
                        Account
                    </a>
                </Link>  
                <button
                    onClick={() => signOut()}
                    className="focus:outline-none text-base font-medium text-gray-700 hover:text-indigo-600"
                >
                    Logout
                </button>
              </div>
            </div>
          </div>
        <div 
          onClick={() => setDropdown(false)}
          className={classNames(
            dropdown ? 'bg-black bg-opacity-40 z-10' : '-z-1',
            'absolute w-screen h-screen transition-all ease-in-out duration-300'
          )}
        />  
        <div className="pt-20">
          {children}
        </div>
    </div>
    </>
  )
}