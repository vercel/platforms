import { signOut } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useRequireAuth from '../../lib/useRequireAuth'
import Loader from './Loader'

import { homeLink } from '@/lib/conditionalLinks'
import type { WithChildren } from '@/types'

interface LayoutProps extends WithChildren {
  siteId?: string
}

export default function Layout({ siteId, children }: LayoutProps) {
  const title = 'Platforms on Vercel'
  const description =
    'Create a fullstack application with multi-tenancy and custom domains support using Next.js, Prisma, and PostgreSQL'
  const logo = '/favicon.ico'
  const router = useRouter()
  const sitePage = router.pathname.startsWith('/app/site/[id]')
  const postPage = router.pathname.startsWith('/app/post/[id]')
  const rootPage = !sitePage && !postPage
  const tab = rootPage
    ? router.asPath.split('/')[1]
    : router.asPath.split('/')[3]

  const session = useRequireAuth()
  if (!session) return <Loader />

  return (
    <>
      <div>
        <Head>
          <title>{title}</title>
          <link rel="icon" href={logo} />
          <link rel="shortcut icon" type="image/x-icon" href={logo} />
          <link rel="apple-touch-icon" sizes="180x180" href={logo} />
          <meta name="theme-color" content="#7b46f6" />

          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <meta itemProp="name" content={title} />
          <meta itemProp="description" content={description} />
          <meta itemProp="image" content={logo} />
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={logo} />
          <meta property="og:type" content="website" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@Vercel" />
          <meta name="twitter:creator" content="@StevenTey" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={logo} />
        </Head>
        <div className="absolute left-0 right-0 h-16 border-b bg-white border-gray-200">
          <div className="flex justify-between items-center h-full max-w-screen-xl mx-auto px-10 sm:px-20">
            <div className="flex space-x-4">
              <Link href="/">
                <a className="flex justify-center items-center">
                  {session.user && session.user.image && (
                    <div className="h-8 w-8 inline-block rounded-full overflow-hidden align-middle">
                      <Image
                        src={session.user.image}
                        width={40}
                        height={40}
                        alt={session.user.name ?? 'User avatar'}
                      />
                    </div>
                  )}
                  <span className="sm:block inline-block ml-3 font-medium truncate">
                    {session.user?.name}
                  </span>
                </a>
              </Link>
              <div className="h-8 border border-gray-300" />
              <button
                className="text-gray-500 hover:text-gray-700 transition-all ease-in-out duration-150"
                onClick={() => signOut()}
              >
                Logout
              </button>
            </div>
            <Link href={homeLink}>
              <a
                className="font-cal flex items-center space-x-2 text-gray-700 px-5 py-3 sm:hover:text-black sm:hover:bg-white transition-all ease-in-out duration-150"
                href={homeLink}
              >
                <p className="hidden sm:block">Home</p>
              </a>
            </Link>
          </div>
        </div>
        {rootPage && (
          <div className="absolute left-0 right-0 top-16 flex justify-center items-center font-cal space-x-16 border-b bg-white border-gray-200">
            <Link href="/" passHref>
              <a
                className={`border-b-2 ${
                  tab == '' ? 'border-black' : 'border-transparent'
                } py-3`}
              >
                My Sites
              </a>
            </Link>
            <Link href="/settings" passHref>
              <a
                className={`border-b-2 ${
                  tab == 'settings' ? 'border-black' : 'border-transparent'
                } py-3`}
              >
                Settings
              </a>
            </Link>
          </div>
        )}
        {sitePage && (
          <div className="absolute left-0 right-0 top-16 font-cal border-b bg-white border-gray-200">
            <div className="flex justify-between items-center space-x-16 max-w-screen-xl mx-auto px-10 sm:px-20">
              <Link href="/" passHref>
                <a>
                  ←<p className="md:inline-block ml-3 hidden">All Sites</p>
                </a>
              </Link>
              <div className="flex justify-between items-center space-x-10 md:space-x-16">
                <Link href={`/site/${router.query.id}`} passHref>
                  <a
                    className={`border-b-2 ${
                      !tab ? 'border-black' : 'border-transparent'
                    } py-3`}
                  >
                    Posts
                  </a>
                </Link>
                <Link href={`/site/${router.query.id}/drafts`} passHref>
                  <a
                    className={`border-b-2 ${
                      tab == 'drafts' ? 'border-black' : 'border-transparent'
                    } py-3`}
                  >
                    Drafts
                  </a>
                </Link>
                <Link href={`/site/${router.query.id}/settings`} passHref>
                  <a
                    className={`border-b-2 ${
                      tab == 'settings' ? 'border-black' : 'border-transparent'
                    } py-3`}
                  >
                    Settings
                  </a>
                </Link>
              </div>
              <div />
            </div>
          </div>
        )}
        {postPage && (
          <div className="absolute left-0 right-0 top-16 font-cal border-b bg-white border-gray-200">
            <div className="flex justify-between items-center space-x-16 max-w-screen-xl mx-auto px-10 sm:px-20">
              {siteId ? (
                <Link href={`/site/${siteId}`} passHref>
                  <a>
                    ←<p className="md:inline-block ml-3 hidden">All Posts</p>
                  </a>
                </Link>
              ) : (
                <div>
                  {' '}
                  ←<p className="md:inline-block ml-3 hidden">All Posts</p>
                </div>
              )}

              <div className="flex justify-between items-center space-x-10 md:space-x-16">
                <Link href={`/post/${router.query.id}`} passHref>
                  <a
                    className={`border-b-2 ${
                      !tab ? 'border-black' : 'border-transparent'
                    } py-3`}
                  >
                    Editor
                  </a>
                </Link>
                <Link href={`/post/${router.query.id}/settings`} passHref>
                  <a
                    className={`border-b-2 ${
                      tab == 'settings' ? 'border-black' : 'border-transparent'
                    } py-3`}
                  >
                    Settings
                  </a>
                </Link>
              </div>
              <div />
            </div>
          </div>
        )}
        <div className="pt-28">{children}</div>
      </div>
    </>
  )
}
