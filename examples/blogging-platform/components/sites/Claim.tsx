import {useState} from 'react'

export default function Claim ({subdomain}) {

    const [claiming, setClaiming] = useState(false)

  return (
    <>
      <div className="flex h-screen w-screen text-center bg-white">
        <div className="m-auto">
          <h1 className="mt-2 block text-4xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-6xl">
              {subdomain}
          </h1>
          <p className="mt-16 text-2xl text-gray-500 leading-8">
              {subdomain} is available.
          </p>
          <a
              href="https://app.platformize.co"
              onClick={() => setClaiming(true)}
              className="m-auto px-10 py-3 w-10/12 sm:w-1/2 mt-10 block bg-black hover:bg-gray-800 rounded-2xl text-white text-2xl font-medium"
          >
              {claiming?
                  "Claiming site..."
                  :
                  "Claim it now!"
              }
          </a>
          </div>
      </div>
    </>
  )
}