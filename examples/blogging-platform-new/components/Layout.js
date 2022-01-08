import Head from 'next/head';
import Link from 'next/link';
import Logo from '@/components/Logo';
import Image from 'next/image';
import { useSession, signIn } from 'next-auth/react';
import SearchBar from '@/components/SearchBar';
import { Menu, Transition } from '@headlessui/react';
import { useState, useEffect, useCallback, Fragment } from 'react';
import LogoSmall from './LogoSmall';
import Cookies from 'js-cookie';
import TwitterIcon from './icons/twitter';

import { useWeb3Auth } from '@/lib/use-web3-auth';

export default function Layout({
  meta,
  children,
  allDaos,
  home,
  blog,
  nftPage,
}) {
  const { web3user, setShowModal } = useWeb3Auth();

  // const [balance, setBalance] = useState(null);

  // useEffect(() => {
  //     library
  //         ?.getBalance(account)
  //         .then((data) => {
  //             setBalance(parseFloat(formatEther(data)))
  //         })
  // }, [library, account])

  const { data: session } = useSession();

  const [scrolled, setScrolled] = useState(false);
  const [hideBanner, setHideBanner] = useState(
    Cookies.get('hideBannerDaoCentral'),
  );

  const onScroll = useCallback(() => {
    setScrolled(home ? window.pageYOffset > 430 : window.pageYOffset > 100);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  return (
    <div>
      <Head>
        <title>{meta?.title}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" type="image/x-icon" href={meta?.logo} />
        <link rel="apple-touch-icon" sizes="180x180" href={meta?.logo} />
        <meta name="theme-color" content="#7b46f6" />

        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta itemProp="name" content={meta?.title} />
        <meta itemProp="description" content={meta?.description} />
        <meta itemProp="image" content={meta?.ogImage} />
        <meta name="description" content={meta?.description} />
        <meta property="og:title" content={meta?.title} />
        <meta property="og:description" content={meta?.description} />
        <meta property="og:url" content={meta?.ogUrl} />
        <meta property="og:image" content={meta?.ogImage} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Elegance" />
        <meta name="twitter:creator" content="@StevenTey" />
        <meta name="twitter:title" content={meta?.title} />
        <meta name="twitter:description" content={meta?.description} />
        <meta name="twitter:image" content={meta?.ogImage} />
      </Head>
      {!nftPage && (
        <header>
          <div
            className={`fixed top-0 w-full ${
              scrolled ? 'drop-shadow-md' : ''
            } bg-white z-30 transition-all ease duration-150`}
          >
            {!hideBanner && (
              <Link href="/blog/viral-nft-drop">
                <a>
                  <div className="flex flex-row items-center justify-between w-full h-10 px-4 font-semibold text-sm border-b border-gray-500 border-opacity-10 bg-gray-100">
                    <div className="w-5" />
                    <p className="hidden sm:block">
                      On Launching A Viral NFT Drop →
                    </p>
                    <p className="sm:hidden">On Launching A Viral NFT Drop →</p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setHideBanner(true);
                        Cookies.set('hideBannerDaoCentral', true);
                      }}
                    >
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </a>
              </Link>
            )}
            <div className="flex gap-4 xl:gap-6 justify-between items-center 2xl:w-1536 m-auto px-5 sm:px-10 w-full h-20">
              <div className="flex justify-start items-center gap-4 xl:gap-6 w-full">
                <Link href="/">
                  <a>
                    <Logo className="hidden md:block" />
                    {home && !scrolled ? (
                      <Logo className="md:hidden" />
                    ) : (
                      <LogoSmall className="md:hidden" />
                    )}
                  </a>
                </Link>
                {(!home || scrolled) && !blog && (
                  <SearchBar allDaos={allDaos} />
                )}
                {blog && (
                  <>
                    <div className="my-5 h-8 border border-gray-500" />
                    <Link href="/blog">
                      <a className="font-cal text-2xl tracking-wide">Blog</a>
                    </Link>
                  </>
                )}
              </div>
              <div className="hidden lg:flex gap-4 xl:gap-6 justify-between items-center">
                <Link href="/add">
                  <a className="whitespace-nowrap font-cal tracking-wide py-2 px-5 text-lg border-2 border-white text-gray-800 hover:text-black transition-all ease duration-150">
                    Add a DAO
                  </a>
                </Link>
                {session ? (
                  <Link href={`/${session.user.username}`}>
                    <a>
                      <div className="relative shadow-2xl inline-block w-12 h-12 border-2 border-gray-100 hover:border-black rounded-full overflow-hidden transition-all ease duration-150">
                        <Image
                          src={
                            session.user.image
                              ? session.user.image
                              : `https://avatar.tobi.sh/${session.user.username}`
                          }
                          alt={session.user.name}
                          width={16}
                          height={16}
                          layout="responsive"
                          objectFit="cover"
                        />
                      </div>
                    </a>
                  </Link>
                ) : web3user?.wallet ? (
                  <Link href={`/${web3user.wallet}`}>
                    <a>
                      <div className="relative shadow-2xl inline-block w-12 h-12 border-2 border-gray-100 hover:border-black rounded-full overflow-hidden transition-all ease duration-150">
                        <Image
                          src={
                            web3user.image
                              ? web3user.image
                              : `https://avatar.tobi.sh/${web3user.wallet}`
                          }
                          alt={web3user.name}
                          width={16}
                          height={16}
                          layout="responsive"
                          objectFit="cover"
                        />
                      </div>
                    </a>
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      //setShowModal(true);
                      signIn('twitter');
                    }}
                    className="font-cal whitespace-nowrap tracking-wide py-2 px-5 text-lg border-2 border-black rounded-md bg-black text-white hover:bg-white hover:text-black transition-all ease duration-150"
                  >
                    Sign In
                  </button>
                )}
              </div>
              <MobileDropdown
                session={session}
                setShowModal={setShowModal}
                web3user={web3user}
              />
            </div>
          </div>
        </header>
      )}
      <div
        className={`w-full ${!nftPage && (!hideBanner ? 'my-30' : 'my-20')}`}
      >
        {children}
      </div>
      <footer
        className={`${
          nftPage ? 'bg-[#1D1D1C] py-10' : 'border-t'
        } md:flex hidden justify-between items-center px-10`}
      >
        <Link href="/blog">
          <a className="text-gray-500 text-lg font-cal hover:text-black transition-all ease duration-150">
            Blog
          </a>
        </Link>
        {!nftPage && (
          <div className="flex items-center justify-center w-full h-20">
            <a
              //className="flex items-center justify-center"
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
            >
              <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" />
            </a>
            <a href="https://nextjs.org/" target="_blank">
              <img src="/nextjs.png" alt="Next.js Logo" className="h-8 ml-5" />
            </a>
            <a href="https://tailwindcss.com/" target="_blank">
              <img
                src="/tailwind.png"
                alt="Tailwind Logo"
                className="h-8 ml-2"
              />
            </a>
            <a href="https://prisma.io/" target="_blank">
              <img
                src="/prisma.svg"
                alt="Prisma Logo"
                className="h-8 ml-2 -mt-1"
              />
            </a>
            <a href="https://planetscale.com/" target="_blank">
              <img
                src="/planetscale.png"
                alt="Planetscale Logo"
                className="h-5 ml-4 -mt-1"
              />
            </a>
            <a href="https://github.com/calendso/font" target="_blank">
              <img
                src="/calsans.png"
                alt="Cal Sans Logo"
                className="h-5 ml-2 -mt-2"
              />
            </a>
          </div>
        )}
        <a href="https://twitter.com/DAOCentral" target="_blank">
          <TwitterIcon
            width={20}
            height={20}
            className="text-gray-500 hover:text-black transition-all ease duration-150"
          />
        </a>
      </footer>

      <footer className="md:hidden">
        <div
          className={`${
            nftPage ? 'bg-[#1D1D1C] grid-rows-1' : 'border-t grid-rows-4'
          } grid grid-cols-2 gap-8 p-8 w-full`}
        >
          {!nftPage && (
            <>
              <a
                className="flex items-center justify-center"
                href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                target="_blank"
              >
                <img src="/vercel.svg" alt="Vercel Logo" className="h-4" />
              </a>
              <a
                className="flex items-center justify-center"
                href="https://nextjs.org/"
                target="_blank"
              >
                <img src="/nextjs.png" alt="Next.js Logo" className="h-8" />
              </a>
              <a
                className="flex items-center justify-center"
                href="https://tailwindcss.com/"
                target="_blank"
              >
                <img src="/tailwind.png" alt="Tailwind Logo" className="h-8" />
              </a>
              <a
                className="flex items-center justify-center"
                href="https://prisma.io/"
                target="_blank"
              >
                <img
                  src="/prisma.svg"
                  alt="Prisma Logo"
                  className="h-8 -mt-1"
                />
              </a>
              <a
                className="flex items-center justify-center"
                href="https://planetscale.com/"
                target="_blank"
              >
                <img
                  src="/planetscale.png"
                  alt="Planetscale Logo"
                  className="h-5 -mt-1"
                />
              </a>
              <a
                className="flex items-center justify-center"
                href="https://github.com/calendso/font"
                target="_blank"
              >
                <img
                  src="/calsans.png"
                  alt="Cal Sans Logo"
                  className="h-5 ml-2 -mt-2"
                />
              </a>
            </>
          )}
          <Link href="/blog">
            <a className="flex items-center justify-center text-gray-500 text-lg font-bold hover:text-black transition-all ease duration-150">
              Blog
            </a>
          </Link>
          <a
            href="https://twitter.com/DAOCentral"
            target="_blank"
            className="flex items-center justify-center"
          >
            <TwitterIcon
              width={20}
              height={20}
              className="text-gray-500 hover:text-black transition-all ease duration-150"
            />
          </a>
        </div>
      </footer>
    </div>
  );
}

const MobileDropdown = ({ session, setShowModal, web3user }) => {
  return (
    <Menu as="div" className="lg:hidden mt-1">
      <div>
        <Menu.Button>
          <svg
            className="h-8 w-8"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
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
        <Menu.Items className="absolute right-10 w-56 mt-2 origin-top-right bg-white border border-gray-100 rounded-md shadow-lg overflow-hidden focus:outline-none">
          <div className="flex flex-col items-center text-center">
            <Menu.Item>
              <Link href="/add">
                <a className="font-cal tracking-wide w-full p-5 text-lg">
                  Add a DAO
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item>
              {session ? (
                <Link href={`/${session.user.username}`}>
                  <a>
                    <div className="relative shadow-2xl inline-block w-12 h-12 border-2 border-gray-100 hover:border-black rounded-full overflow-hidden transition-all ease duration-150">
                      <Image
                        src={session.user.image}
                        alt={session.user.name}
                        width={16}
                        height={16}
                        layout="responsive"
                        objectFit="cover"
                      />
                    </div>
                  </a>
                </Link>
              ) : web3user?.wallet ? (
                <Link href={`/${web3user.wallet}`}>
                  <a>
                    <div className="relative shadow-2xl inline-block w-12 h-12 border-2 border-gray-100 hover:border-black rounded-full overflow-hidden transition-all ease duration-150">
                      <Image
                        src={
                          web3user.image
                            ? web3user.image
                            : `https://avatar.tobi.sh/${web3user.wallet}`
                        }
                        alt={web3user.name}
                        width={16}
                        height={16}
                        layout="responsive"
                        objectFit="cover"
                      />
                    </div>
                  </a>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setShowModal(true);
                  }}
                  className="w-full p-5 bg-black text-white text-lg text-left"
                >
                  {web3user?.ens
                    ? web3user.ens
                    : web3user?.wallet
                    ? web3user.wallet
                    : 'Sign In'}
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
