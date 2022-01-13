import { signIn } from 'next-auth/client'
import Head from 'next/head'
import { useState, useEffect } from 'react'

const pageTitle = 'Login'
const logo = '/favicon.ico'
const description = 'Platformize is a NextJS solution that allows you to build your own Substack/Webflow clone with built-in multi-tenancy and custom domains. '

export default function Login() {
  
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
      if(submitting) {
        setTimeout(() => {
          setSubmitted(true)
          setSubmitting(false)
        }, 2500)
      }
    }, [submitting])

    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <Head>
          <title>{pageTitle}</title>
          <link rel="icon" href={logo} />
          <link rel="shortcut icon" type="image/x-icon" href={logo}/>
          <link rel="apple-touch-icon" sizes="180x180" href={logo}/>
          <meta name="theme-color" content="#7b46f6"/>

          <meta charSet="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>

          <meta itemProp="name" content={pageTitle}/>
          <meta itemProp="description" content={description}/>
          <meta itemProp="image" content={logo}/>
          <meta name="description" content={description}/>
          <meta property="og:title" content={pageTitle}/>
          <meta property="og:description" content={description}/>
          <meta property="og:image" content={logo}/>
          <meta property="og:type" content="website"/>

          <meta name="twitter:card" content="summary_large_image"/>
          <meta name="twitter:site" content="@Elegance" />
          <meta name="twitter:creator" content="@StevenTey"/>
          <meta name="twitter:title" content={pageTitle}/>
          <meta name="twitter:description" content={description}/>
          <meta name="twitter:image" content={logo}/>
      </Head>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto"
            src="/logo.png"
            alt="Platformize"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Password-less signup powered by{' '}
            <a href="https://next-auth.js.org/" target="_blank" className="font-medium text-black hover:text-gray-800">
                next-auth
            </a>
          </p>
        </div>
  
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
            <form 
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitting(true); 
                signIn('email', { redirect: false, email: event.target.email.value })
              }}
              className="space-y-6"
            >
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address (disabled)
                </label>
                <div className="mt-1">
                  <input
                    name="email"
                    type="email"
                    required
                    disabled
                    autoComplete="email"
                    className="cursor-not-allowed appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                  />
                </div>
              </div>
  
              <div>
                <button
                  type="submit"
                  disabled
                  className={`cursor-not-allowed transition duration-250 ease-in-out w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${ submitted ? "bg-green-600 hover:bg-green-700 focus:ring-green-500" : "bg-black hover:bg-gray-800 focus:ring-black" } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                >
                  {submitting ? 
                      <>
                        Sending email with magic link...
                        <svg
                          className="animate-spin ml-3 mr-3 mt-0.5 h-4 w-4 text-white"
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
                       : submitted ? 
                       <>
                        Email sent – check your inbox!
                        <svg xmlns="http://www.w3.org/2000/svg" class="ml-3 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                       </> :
                        'Sign In with Email (disabled)' }
                </button>
              </div>
            </form>
  
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
  
              <div className="mt-6 grid grid-cols-2 gap-3">
  
                <div>
                  <button
                    onClick={() => signIn('twitter')} 
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-black hover:bg-gray-50 hover:text-gray-800"
                  >
                    <span className="sr-only">Sign in with Twitter</span>
                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </button>
                </div>
  
                <div>
                  <button
                    onClick={() => signIn('github')} 
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-black hover:bg-gray-50 hover:text-gray-800"
                  >
                    <span className="sr-only">Sign in with GitHub</span>
                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export async function getStaticProps(){
    return {
      props: {}
    }
}