import React, {Fragment, useState} from "react"
import { Transition, Dialog } from '@headlessui/react'
import { useRouter } from "next/router"

export default function CreateSiteOverlay({session, open, setOpen, rootUrl}) {

    const [creating, setCreating] = useState(false)
    const [subdomainError, setSubdomainError] = useState(false)

    const router = useRouter()
    
    async function createSite(e, userId) {
        setSubdomainError(false)
        const res = await fetch(
            `/api/create-site?name=${e.target.name.value}&url=${e.target.subdomain.value}&description=${e.target.description.value}&userId=${userId}`, 
            { method: 'POST' }
        )
        if (res.ok) {
          const data = await res.json()
          setTimeout(() => {
              router.push(`/site/${data.siteId}`)
          }, 800)
        } else {
          setCreating(false)
          setSubdomainError(true)
        }
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog
                as="div"
                static
                className="fixed z-50 inset-0 overflow-y-auto"
                open={open}
                onClose={setOpen}
            >
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                {/* This element is to trick the browser into centering the modal contents. */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                    &#8203;
                </span>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <form onSubmit={(event) => {event.preventDefault(); setCreating(true); createSite(event, session?.user?.id)}} className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div className="bg-white px-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <Dialog.Title as="h3" className="text-2xl text-center mt-3 leading-6 font-semibold text-gray-900">
                                Create a new site
                                </Dialog.Title>
                                <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                                <div className="sm:grid sm:grid-cols-4 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                    Name
                                    </label>
                                    <div className="mt-1 sm:mt-0 sm:col-span-3">
                                        <input
                                        type="text"
                                        name="name"
                                        autoComplete="off"
                                        required
                                        className="rounded-md border border-solid border-gray-300 focus:border-black p-2 w-full focus:outline-none min-w-0 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="sm:grid sm:grid-cols-4 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                    Subdomain
                                    </label>
                                    <div className="mt-1 sm:mt-0 sm:col-span-3">
                                    <div className="max-w-lg flex rounded-md shadow-sm">
                                        <input
                                        type="text"
                                        name="subdomain"
                                        autoComplete="off"
                                        required
                                        className="flex-1 block p-2 w-full min-w-0 rounded-none rounded-l-md sm:text-sm focus:outline-none border border-solid border-gray-300 focus:border-black"
                                        />
                                        <span className="inline-flex items-center px-3 w-1/2 rounded-r-md border border-l-0 border-r-1 border-t-1 border-b-1 border-gray-300 bg-gray-100 text-gray-600 sm:text-sm">
                                        .{rootUrl}
                                        </span>
                                    </div>
                                    </div>
                                </div>
                                {subdomainError && <p className="text-sm text-red-600 mt-5">This subdomain is taken. Please choose another one.</p>}

                                <div className="sm:grid sm:grid-cols-4 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                    <label htmlFor="about" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                    Description
                                    </label>
                                    <div className="mt-1 sm:mt-0 sm:col-span-3">
                                    <textarea
                                        name="description"
                                        rows={3}
                                        placeholder="The hottest gossip about armadilos"
                                        className="max-w-lg shadow-sm block p-2 w-full sm:text-sm border border-solid border-gray-300 focus:border-black focus:outline-none rounded-md"
                                    />
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 mt-10 px-4 pb-6 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                {creating ? 
                                    <>
                                        Creating site...
                                        <svg
                                        className="animate-spin ml-3 mt-1 h-4 w-4 text-white"
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
                                : "Create Site" }
                            </button>
                            <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={() => {setOpen(false); setCreating(false)}}
                            >
                            Cancel
                            </button>
                        </div>
                    </form>
                </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}