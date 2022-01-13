import Layout from "../../components/app/Layout"
import CreateSiteOverlay from "../../components/app/CreateSiteOverlay"
import DeleteSiteOverlay from "../../components/app/DeleteSiteOverlay"
import Link from "next/link"
import Image from "next/image"
import React, {Fragment, useState} from "react"
import useSWR from 'swr'
import { useSession } from "next-auth/client"
import { Menu, Transition } from '@headlessui/react'
import {
  ExternalLinkIcon,
  CogIcon,
  PlusIcon,
} from '@heroicons/react/outline'

function stopPropagation(e) {
  e.stopPropagation();
}
function preventDefault(e) {
  e.preventDefault();
}

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Index () {

    const [open, setOpen] = useState(false)
    const [openDelete, setOpenDelete] = useState(false) 
    const [siteToDelete, setSiteToDelete] = useState('')

    const [ session ] = useSession()
    const sessionId = session?.user?.id
    const { data } = useSWR(sessionId && `/api/get-sites?sessionId=${sessionId}`, fetcher)

    return (
      <>
        <Layout>

          <CreateSiteOverlay
            session={session}
            open={open}
            setOpen={setOpen}
            rootUrl={process.env.NEXT_PUBLIC_ROOT_URL}
          />

          <DeleteSiteOverlay
            openDelete={openDelete}
            setOpenDelete={setOpenDelete}
            siteToDelete={siteToDelete}
          />          

          <div className="w-11/12 sm:w-7/12 mx-auto mt-16">
            <div className="flex justify-between px-4">
              <h1 className="font-bold text-2xl sm:text-3xl m-5 mb-10">
                My Sites
              </h1>
              <button onClick={()=>setOpen(true)} className="bg-gray-900 px-5 h-12 mt-3 sm:mt-5 rounded-3xl text-base sm:text-lg text-white hover:bg-gray-700 focus:outline-none">
                New Site
                <PlusIcon
                    className="h-5 w-5 inline-block ml-2"
                />
              </button>
            </div>
            {data && data.sites.length == 0 ?
            <>
              <img className="mx-auto" src="/empty-state.webp" />
              <p className="text-center mb-48 mt-10 text-gray-800 font-semibold text-xl">No sites yet. Click the button above to create one.</p>
            </>
            : null}
            {data ? data.sites.map((site) => (
              <Link href={`/site/${site.id}`}>
                <a>
                <div className="sm:px-5 sm:flex space-y-5 sm:space-y-0 sm:space-x-10 mb-10 py-8 rounded-lg cursor-pointer hover:bg-gray-100">
                  <div className="w-10/12 mx-auto sm:w-1/3 overflow-hidden rounded-lg">
                    <Image
                      width={2048}
                      height={1170}
                      layout="responsive"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2PYsGHDfwAHNAMQumvbogAAAABJRU5ErkJggg=="
                      src={site.image}
                      />
                  </div>
    
                  <div className="relative w-10/12 mx-auto sm:w-7/12 space-y-2 sm:space-y-3">
                  <Menu onClick={preventDefault} as="div" className="absolute right-0 top-0 mr-3 mt-3">
                    <div>
                      <a onClick={stopPropagation} href={`https://${site.url}.${process.env.NEXT_PUBLIC_ROOT_URL}`} target="_blank" 
                      >
                        <ExternalLinkIcon
                            className="h-6 w-6 inline-block sm:hidden"
                        />
                      </a>
                      <Menu.Button className="p-2 text-black rounded-full hover:bg-gray-400 focus:outline-none">
                        <CogIcon
                          className="h-6 w-6 inline-block"
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute z-20 right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-300 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-1 py-1 ">
                          <Menu.Item>
                              <Link href={`/site/${site.id}`}>
                                <a className='text-gray-900 hover:bg-gray-300 group flex rounded-md items-center w-full px-2 py-2 text-sm'>
                                  Posts
                                </a>
                              </Link>
                          </Menu.Item>
                          <Menu.Item>
                            <Link href={`/site/${site.id}/drafts`}>
                              <a className='text-gray-900 hover:bg-gray-300 group flex rounded-md items-center w-full px-2 py-2 text-sm'>
                                Drafts
                              </a>
                            </Link>
                          </Menu.Item>
                          <Menu.Item>
                              <Link href={`/site/${site.id}/settings`}>
                                <a className='text-gray-900 hover:bg-gray-300 group flex rounded-md items-center w-full px-2 py-2 text-sm'>
                                  Settings
                                </a>
                              </Link>
                            </Menu.Item>
                        </div>
                        <div className="px-1 py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={()=> {setOpenDelete(true); setSiteToDelete(site.id)}}
                                className={`${
                                  active ? 'bg-red-300 text-red-700' : 'text-red-700'
                                } group flex focus:outline-none rounded-md items-center w-full px-2 py-2 text-sm`}
                              >
                                Delete
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                    <p className="text-xl sm:text-3xl font-semibold text-gray-900">{site.name}</p>
                    <p className="text-base sm:text-lg text-gray-600 truncate w-9/12 sm:w-10/12">{site.description}</p>
                    <a onClick={stopPropagation} href={`https://${site.url}.${process.env.NEXT_PUBLIC_ROOT_URL}`} target="_blank" 
                      className="absolute bg-gray-900 hidden sm:block py-3 px-8 rounded-3xl text-lg text-white hover:bg-gray-700"
                    >
                      {site.url}.{process.env.NEXT_PUBLIC_ROOT_URL}
                      <ExternalLinkIcon
                          className="h-5 w-5 inline-block ml-2"
                      />
                    </a>
                  </div>
                </div>
                </a>
              </Link>
            )) : 
              [...Array(4)].map((_) => (
                  <div className="w-full h-48 mb-10 bg-gray-100 animate-pulse rounded-lg">
                  </div>
              ))
            }
          </div>
        </Layout>
      </>
    )
}