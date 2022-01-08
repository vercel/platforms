import Layout from '../../../../components/app/Layout'
import InnerLayout from '../../../../components/app/InnerLayout'
import DeletePostOverlay from '../../../../components/app/DeletePostOverlay'
import useSWR from 'swr'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/router'
import { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import {
  DotsHorizontalIcon,
  PlusIcon,
} from '@heroicons/react/outline'

function stopPropagation(e) {
    e.stopPropagation();
}

const publish = async (siteId, postId) => {
    await fetch(`/api/publish-post?siteId=${siteId}&postId=${postId}`, {
        method: 'POST',
    })
    window.location.reload();
}

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Drafts () {
    
    const router = useRouter()
    const { id } = router.query
    const siteId = id

    const [creating, setCreating] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [toDelete, setToDelete] = useState('')

    const { data } = useSWR(`/api/get-drafts?siteId=${siteId}`, fetcher)

    async function createPost(siteUrl) {
        const res = await fetch(
            `/api/create-post?siteUrl=${siteUrl}`, 
            { method: 'POST' }
        )
        if (res.ok) {
          const data = await res.json()
          router.push(`/post/${data.postId}`)
        }
    }

    return (
        <>
            <Layout>
                <DeletePostOverlay
                    data={data}
                    openDelete={openDelete}
                    setOpenDelete={setOpenDelete}
                    toDelete={toDelete}
                    draft={true}
                />
                
                <InnerLayout siteId={siteId} tab="drafts">
                    <div className="pt-16 sm:pl-10 col-span-4 sm:col-span-3">
                        <div className="flex justify-between">
                        <h1 className="font-bold text-2xl sm:text-3xl m-5 mb-10">
                            My Drafts
                        </h1>
                        <button 
                            onClick={() => {setCreating(true); ; createPost(data.site.url)}}
                            className="inline-flex justify-center bg-gray-900 px-5 py-2 h-12 mt-5 rounded-3xl text-lg text-white hover:bg-gray-700 focus:outline-none"
                        >
                            {creating ? 
                                <>
                                    Creating post...
                                    <svg
                                    className="animate-spin ml-3 mt-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        stroke-width="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                    </svg>
                                </>
                            : 
                            <>
                                New Post
                                <PlusIcon
                                    className="h-5 w-5 inline-block ml-2 mt-1"
                                />
                            </>}
                        </button>
                        </div>
                        {data && data.drafts.length == 0 ?
                        <>
                        <img className="mt-10 mb-20" src="/empty-state.webp" />
                        <p className="text-center mb-48 mt-10 text-gray-800 font-semibold text-xl">No drafts yet. Click the button above to create one.</p>
                        </>
                        : null}
                        {data ? data.drafts.map((post) => (
                            <Link href={`/post/${post.id}`}>
                                <div className="p-8 mb-3 pr-20 flex justify-between bg-gray-200 hover:bg-gray-300 rounded-lg cursor-pointer">                    
                                    <div className="relative space-y-5">
                                        <p className="text-2xl font-semibold text-gray-900">{post.title}</p>
                                        <p className="mt-3 text-lg text-gray-600">
                                            <time dateTime={post.createdAt}>
                                                {`${Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(post.createdAt))} ${Intl.DateTimeFormat('en', { day: '2-digit' }).format(new Date(post.createdAt))} at ${Intl.DateTimeFormat('en', { hour: 'numeric', minute: 'numeric' }).format(new Date(post.createdAt))}`}
                                            </time>
                                        </p>
                                    </div>
                                    <div>
                                        <Menu onClick={stopPropagation} as="div" className="absolute inline-block my-6">
                                            <div>
                                            <Menu.Button className="focus:outline-none">
                                                <DotsHorizontalIcon
                                                    className="h-10 w-10 p-2"
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
                                                        <Link href={`/post/${post.id}`}>
                                                            <a className='text-gray-900 hover:bg-gray-300 group flex rounded-md items-center w-full px-2 py-2 text-sm'>
                                                                Edit draft
                                                            </a>
                                                        </Link>
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                onClick={(e)=> {e.stopPropagation(); publish(data.site.id, post.id)}}
                                                                className={`${
                                                                active ? 'bg-gray-300' : null
                                                                } group flex text-gray-900 focus:outline-none rounded-md items-center w-full px-2 py-2 text-sm`}
                                                            >
                                                                Publish draft
                                                            </button>  
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        <Link href={`/post/${post.id}/settings`}>
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
                                                        onClick={()=>{setOpenDelete(true); setToDelete(post.id)}}
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
                                    </div>
                                </div>
                            </Link>
                        )) : 
                            [...Array(4)].map((_) => (
                                <div className="w-full h-36 mb-3 bg-gray-200 animate-pulse rounded-lg">
                                </div>
                            ))
                        }
                    </div>
                </InnerLayout>
            </Layout>
        </>
    )
}