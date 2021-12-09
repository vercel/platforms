import Head from 'next/head'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import LoadingDots from '../components/loading-dots'
import toast, { Toaster } from 'react-hot-toast';
import useSWR, { mutate } from 'swr'
const fetcher = (...args) => fetch(...args).then(res => res.json())
import Image from 'next/image'

export default function Home() {

  const [domain, setDomain] = useState('')
  const [domainList, setDomainList] = useState(Cookies.get('domainList') ? JSON.parse(Cookies.get('domainList')) : ['platformizer.co', 'vercel.pub']) // initialize the state with two default domains
  const [disabled, setDisabled] = useState(true)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (domain.length == 0) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  }, [domain])

  useEffect(() => {
    if (adding) setDisabled(true)
  }, [adding])

  useEffect(() => {
    Cookies.set('domainList', JSON.stringify(domainList))
  }, [domainList])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Domains API</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster
          position="bottom-right"
          toastOptions={{
              duration: 10000,
          }}
      />
      <a href="https://github.com/vercel-customer-feedback/platforms/tree/main/code-snippets/domains-api" target="_blank" className="fixed top-5 right-5">
        <Image src="/github.svg" alt="Github" width={24} height={24}/>
      </a>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center my-20">
        <h1 className="text-6xl font-bold">
          Domains API
        </h1>

        <form
            onSubmit={async (e) => {
              e.preventDefault()
              setAdding(true)
              await fetch(`/api/add-domain?domain=${domain}`).then((res) => {
                  setAdding(false)
                  if (res.ok) {
                    setError(null)
                    setDomainList([...domainList, domain])
                    e.target.domain.value = ''
                  } else {
                    const errorDomain = domain
                    setError({code: res.status, domain: errorDomain})
                  }
              })
            }}
            className="flex justify-between space-x-4 w-full max-w-2xl h-10 mt-10"
        >
          <input
            type="text"
            name="domain"
            onInput={(e) => { setDomain(e.target.value) }}
            autoComplete="off"
            placeholder="mydomain.com"
            pattern="^(?:[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.)?[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$"
            required
            className="rounded-md border border-gray-300 focus:ring-0 focus:border-black px-4 flex-auto min-w-0 sm:text-sm"
          />
          <button 
              type="submit"
              disabled={disabled}
              className={`${disabled ? 'cursor-not-allowed bg-gray-100 text-gray-500 border-gray-300' : 'bg-black text-white border-black hover:text-black hover:bg-white'} py-2 w-28 text-sm border-solid border rounded-md focus:outline-none transition-all ease-in-out duration-150`}
          >
              {adding ?  <LoadingDots /> : 'Add'}
          </button>
        </form>

        {error && 
          <div className="text-red-500 text-left w-full max-w-2xl mt-5 text-sm flex items-center space-x-2">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" shapeRendering="geometricPrecision" style={{color: "#f44336"}}>
              <circle cx="12" cy="12" r="10" fill="white"/>
              <path d="M12 8v4" stroke="#f44336"/>
              <path d="M12 16h.01" stroke="#f44336"/>
            </svg>
            {
              error.code == 403 
              ?
                <p>
                  <b>{error.domain}</b> is already owned by another team.
                  <button 
                    className="ml-1"
                    onClick={async (e) => {
                      e.preventDefault()
                      await fetch(`/api/request-delegation?domain=${error.domain}`).then((res) => {
                          if (res.ok) {
                            toast.success(`Requested delegation for ${error.domain}`)
                          } else {
                            alert('There was an error requesting delegation. Please try again later.')
                          }
                      })
                    }}
                  >
                    <u>Click here to request access.</u>
                  </button>
                </p>
              :
                <p>
                  Cannot add <b>{error.domain}</b> since it's already assigned to another project.
                </p>
            }
          </div>
        }
        
        <div className="w-full max-w-2xl">
          {domainList.map((domain, index) => {
            return (
              <DomainCard key={index} domain={domain} domainList={domainList} setDomainList={setDomainList}/>
            )
          })}
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" />
        </a>
      </footer>
    </div>
  )
}

const DomainCard = ({ domain, domainList, setDomainList }) => {

  const { data: valid, isValidating } = useSWR(`/api/check-domain?domain=${domain}`, fetcher, {revalidateOnMount: true, refreshInterval: 5000})
  const [recordType, setRecordType] = useState('CNAME')
  const [removing, setRemoving] = useState(false)

  return (
    <div className="w-full mt-10 shadow-md border border-gray-50 rounded-lg py-10">
      <div className="flex justify-between space-x-4 px-10">
        <a href={`http://${domain}`} target="_blank" className="text-xl font-semibold flex items-center">
          {domain}
          <span className="inline-block ml-2">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" shape-rendering="geometricPrecision">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <path d="M15 3h6v6"/><path d="M10 14L21 3"/>
            </svg>
          </span>
        </a>
        <div className="flex space-x-3">
          <button
              onClick={() => {
                mutate(`/api/check-domain?domain=${domain}`)
              }}
              disabled={isValidating}
              className={`${isValidating ? "cursor-not-allowed bg-gray-100" : "bg-white hover:text-black hover:border-black"} text-gray-500 border-gray-200 py-1.5 w-24 text-sm border-solid border rounded-md focus:outline-none transition-all ease-in-out duration-150`}
          >
              {
                isValidating ? <LoadingDots /> : 'Refresh'
              }
          </button>
          <button
              onClick={async () => {
                setRemoving(true)
                await fetch(`/api/remove-domain?domain=${domain}`).then((res) => {
                    setRemoving(false)
                    if (res.ok) {
                      setDomainList(domainList.filter((item) => item !== domain))
                    } else {
                      alert("Error removing domain")
                    }
                })
              }}
              disabled={removing}
              className={`${removing ? "cursor-not-allowed bg-gray-100" : ""}bg-red-500 text-white border-red-500 hover:text-red-500 hover:bg-white py-1.5 w-24 text-sm border-solid border rounded-md focus:outline-none transition-all ease-in-out duration-150`}
          >
              {removing ?  <LoadingDots /> : 'Remove'}
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-3 my-3 px-10">
        <svg viewBox="0 0 24 24" width="24" height="24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" shapeRendering="geometricPrecision">
          <circle cx="12" cy="12" r="10" fill={valid ? "#1976d2" : "#d32f2f"}/>
          {valid ?
            <>
              <path d="M8 11.8571L10.5 14.3572L15.8572 9" fill="none" stroke="white"/>
            </>
          :
            <>
              <path d="M15 9l-6 6" stroke="white"/>
              <path d="M9 9l6 6" stroke="white"/>
            </>
          }
        </svg>
        <p className={`${valid ? 'text-black font-normal' : 'text-red-700 font-medium'} text-sm`}>{valid ? "Valid" : "Invalid"} Configuration</p>
      </div>

      {
        !valid &&
        <>
          <div className="w-full border-t border-gray-100 mt-5 mb-8" />

          <div className="px-10">
            <div className="flex justify-start space-x-4">
              <button onClick={() => setRecordType('CNAME')} className={`${recordType == 'CNAME' ? 'text-black border-black' : 'text-gray-400 border-white'} text-sm border-b-2 pb-1 transition-all ease duration-150`}>
                CNAME Record (subdomains)
              </button>
              <button onClick={() => setRecordType('A')} className={`${recordType == 'A' ? 'text-black border-black' : 'text-gray-400 border-white'} text-sm border-b-2 pb-1 transition-all ease duration-150`}>
                A Record (apex domain)
              </button>
            </div>
            <div className="my-3 text-left">
              <p className="my-5 text-sm">Set the following record on your DNS provider to continue:</p>
              <div className="flex justify-start items-center space-x-10 bg-gray-50 p-2 rounded-md">
                <div>
                  <p className="text-sm font-bold">Type</p>
                  <p className="text-sm font-mono mt-2">
                    {recordType}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold">Name</p>
                  <p className="text-sm font-mono mt-2">
                    {recordType == 'CNAME' ? "www" : "@"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold">Value</p>
                  <p className="text-sm font-mono mt-2">
                    {recordType == "CNAME" ? `cname.platformize.co` : `76.76.21.21`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      }

    </div>
  )
}