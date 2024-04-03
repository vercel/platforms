'use client' // Error components must be Client Components
 
import { useEffect } from 'react'
import { toast } from 'sonner'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  
  useEffect(() => {

    toast.error(error.message)
  })
 
  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col items-center justify-between">
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          All Sites errors
        </h1>
        <p className='dark:text-white'> {error.message} </p>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        className={`bg-white hover:bg-stone-50 active:bg-stone-100 dark:bg-black dark:hover:border-white dark:hover:bg-black group my-2 flex h-10 p-2 items-center justify-center space-x-2 rounded-md border border-stone-200 transition-colors duration-75 focus:outline-none dark:border-stone-700`}
      
      >
        <span className='text-stone-600 dark:text-stone-400' >Try again</span>
      </button>
    </div>
    </div>
    </div>
  )
}