import Link from 'next/link'
import Image from 'next/image'
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function InnerLayout ({children, siteId, tab}) {

    const { data } = useSWR(`/api/get-posts?siteId=${siteId}`, fetcher)

    return (
        <>
        {/* Mobile Navigation Menu */}
        <div className="sm:hidden flex justfiy-between w-11/12 mx-auto mt-5 text-center">
            <Link href='/'>
                <a className="mx-8 font-semibold text-2xl">
                    ←
                </a>
            </Link>
            <a href={`https://${data ? data.site.url : 'app'}.${process.env.NEXT_PUBLIC_ROOT_URL}`} target="_blank"
                className="flex align-middle"
            >
                {!data 
                    ? 
                    <>
                        <div className="inline-block mx-auto w-10 h-10 rounded-full bg-gray-300 animate-pulse"/>
                        <div className="inline-block mt-2.5 mx-3 w-32 h-5 rounded-md bg-gray-300 animate-pulse"/>
                    </>
                    : 
                    <>
                        <div className="inline-block mx-auto w-10 h-10 rounded-xl overflow-hidden">
                            <Image 
                                width={80}
                                height={80}
                                src={data.site.logo}
                            />
                        </div>
                        <p className="inline-block font-medium text-lg mt-2 mx-3">{data.site.name}</p>
                    </>
                }
            </a>
        </div>
        <div className="sm:hidden flex justfiy-between w-11/12 mx-auto mt-5 space-x-2 text-center pb-5">
            <Link href={`/site/${data ? data.site.id : ''}`}>
                <a className={`font-semibold text-gray-900 ${ tab == 'posts' ? `bg-gray-300` : 'hover:bg-gray-200'} rounded-md w-full px-2 py-2 text-lg`}>
                    Posts
                </a>
            </Link>
            <Link href={`/site/${data ? data.site.id : ''}/drafts`}>
                <a className={`font-semibold text-gray-900 ${ tab == 'drafts' ? `bg-gray-300` : 'hover:bg-gray-200'} rounded-md w-full px-2 py-2 text-lg`}>
                    Drafts
                </a>
            </Link>
            <Link href={`/site/${data ? data.site.id : ''}/settings`}>
                <a className={`font-semibold text-gray-900 ${ tab == 'settings' ? `bg-gray-300` : 'hover:bg-gray-200'} rounded-md w-full px-2 py-2 text-lg`}>
                    Settings
                </a>
            </Link>
        </div>
        <div className="sm:hidden w-full border-t mt-3 -mb-5 border-gray-200" />

        {/* Desktop Navigation Menu */}
        <div className="w-11/12 sm:w-7/12 mx-auto grid grid-cols-4 gap-10 h-screen sm:divide-x">
            <div className="pt-10 hidden sm:block sm:col-span-1">
                <Link href="/">
                    <a className="text-left font-semibold text-lg">
                        ← All Sites 
                    </a>
                </Link>
                <a href={`https://${data ? data.site.url : 'app'}.${process.env.NEXT_PUBLIC_ROOT_URL}`} target="_blank">
                    {!data 
                    ? 
                    <>
                        <div className="relative mx-auto mt-5 mb-3 w-16 h-16 rounded-full bg-gray-300 animate-pulse"/>
                        <div className="mx-auto w-2/3 h-6 rounded-md bg-gray-300 animate-pulse"/>
                    </>
                    : 
                    <>
                        <div className="relative mx-auto mt-5 mb-3 w-16 h-16 rounded-xl overflow-hidden">
                            <Image 
                                width={80}
                                height={80}
                                src={data.site.logo}
                            />
                        </div>
                        <p className="text-center font-medium">{data.site.name}</p>
                    </>
                    }
                </a>

                <div className="text-left grid grid-cols-1 gap-6 mt-10">
                    <Link href={`/site/${data ? data.site.id : ''}`}>
                        <a className={`font-semibold text-gray-900 ${ tab == 'posts' ? `bg-gray-300` : 'hover:bg-gray-200'} rounded-md w-full px-2 py-2 text-lg`}>
                            Posts
                        </a>
                    </Link>
                    <Link href={`/site/${data ? data.site.id : ''}/drafts`}>
                        <a className={`font-semibold text-gray-900 ${ tab == 'drafts' ? `bg-gray-300` : 'hover:bg-gray-200'} rounded-md w-full px-2 py-2 text-lg`}>
                            Drafts
                        </a>
                    </Link>
                    <Link href={`/site/${data ? data.site.id : ''}/settings`}>
                        <a className={`font-semibold text-gray-900 ${ tab == 'settings' ? `bg-gray-300` : 'hover:bg-gray-200'} rounded-md w-full px-2 py-2 text-lg`}>
                            Settings
                        </a>
                    </Link>
                </div>
            </div>
            {children}
        </div>
        </>
    )
}