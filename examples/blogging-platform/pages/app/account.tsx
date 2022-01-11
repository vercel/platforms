import Layout from "../../components/app/Layout"
import { useSession } from 'next-auth/client'

export default function Account () {

    const [session, loading] = useSession()

    return (
        <Layout>
        <>
            <div className="w-11/12 sm:w-1/2 mx-auto gap-10 h-screen sm:divide-x">
                <div className="pt-16 sm:pl-10">
                    <div className="flex justify-between">
                        <h1 className="font-bold text-2xl sm:text-3xl mb-10">
                            Settings
                        </h1>
                    </div>

                    {loading || !session ? 
                    <div className="w-1/6 h-28 mx-auto mb-10 rounded-full bg-gray-200 animate-pulse"/>
                    : 
                    <img
                        className="w-1/6 mx-auto mb-10 rounded-full"
                        src={session.user.image}
                        alt=""
                    />
                    }
                    
                    <form
                        onSubmit={async (e) => {
                            e.target.submit.innerHTML = 'Saving...'
                            e.persist()
                            e.preventDefault()
                            await fetch(`/api/save-account-name?accountId=${session.user.id}&name=${e.target.name.value}`)
                            e.target.submit.innerHTML = 'Save'
                        }}
                        className="sm:gap-4 sm:items-start sm:border-b sm:border-gray-200 py-5 mb-5"
                    >
                        <div className="sm:grid sm:grid-cols-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            Name
                            </label>
                            <div className="mt-1 sm:mt-0 sm:col-span-3">
                                <input
                                type="text"
                                name="name"
                                autoComplete="off"
                                required
                                defaultValue={loading ? '' : session?.user?.name}
                                className="rounded-md border border-solid border-gray-300 p-2 w-full focus:outline-none min-w-0 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div className="w-full flex justify-end mt-3">
                            <button 
                                type="submit"
                                name="submit"
                                className="my-2 py-2 px-8 text-md bg-black text-white border-solid border border-black rounded-lg hover:text-black hover:bg-white focus:outline-none transition-all ease-in-out duration-150"
                            >
                                Save
                            </button>
                        </div>
                    </form>

                    
                    <form
                        onSubmit={async (e) => {
                            e.target.submit.innerHTML = 'Saving...'
                            e.persist()
                            e.preventDefault()
                            await fetch(`/api/save-account-email?accountId=${session.user.id}&email=${e.target.email.value}`)
                            e.target.submit.innerHTML = 'Save'
                        }}
                        className="sm:gap-4 sm:items-start sm:border-b sm:border-gray-200 py-5 mb-5"
                    >
                        <div className="sm:grid sm:grid-cols-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            Email
                            </label>
                            <div className="mt-1 sm:mt-0 sm:col-span-3">
                                <input
                                type="email"
                                name="email"
                                autoComplete="off"
                                required
                                defaultValue={loading ? '' : session?.user?.email}
                                className="rounded-md border border-solid border-gray-300 p-2 w-full focus:outline-none min-w-0 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div className="w-full flex justify-end mt-3">
                            <button 
                                type="submit"
                                name="submit"
                                className="my-2 py-2 px-8 text-md bg-black text-white border-solid border border-black rounded-lg hover:text-black hover:bg-white focus:outline-none transition-all ease-in-out duration-150"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
        </Layout>
    )
}