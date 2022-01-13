import Layout from '../../../../components/app/Layout'
import InnerLayout from '../../../../components/app/InnerLayout'
import useSWR, {mutate} from 'swr'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { QuestionMarkCircleIcon } from '@heroicons/react/solid'

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Settings () {
    
    const router = useRouter()
    const { id } = router.query
    const siteId = id

    const [subdomainError, setSubdomainError] = useState(false)
    const [customDomainConflict, setCustomDomainConflict] = useState(false)
    const [domainDelegated, setDomainDelegated] = useState(false)

    const { data } = useSWR(`/api/get-site-data?siteId=${siteId}`, fetcher, {initialData: {
        name: '',
        url: '',
        customDomain: '',
        description: ''
    }, revalidateOnMount: true})

    return (
        <Layout>
            <InnerLayout siteId={siteId} tab="settings">
                <div className="pt-16 sm:pl-10 col-span-4 sm:col-span-3 sm:m-5">
                    <div className="flex justify-between">
                        <h1 className="font-bold text-2xl sm:text-3xl mb-10">
                            Settings
                        </h1>
                    </div>
                    <form
                        onSubmit={async (e) => {
                            e.target.submit.innerHTML = 'Saving...'
                            e.persist()
                            e.preventDefault()
                            mutate(`/api/get-publication-data?siteId=${siteId}`, { ...data, name: e.target.name.value }, false)
                            await fetch(`/api/save-site-name?name=${e.target.name.value}&siteId=${siteId}`)
                            mutate(`/api/get-publication-data?siteId=${siteId}`)
                            e.target.submit.innerHTML = 'Saved!';
                            setTimeout(function(){
                                e.target.submit.innerHTML = 'Save';
                            }, 3000)
                        }}
                        className="sm:gap-4 sm:items-start sm:border-b sm:border-gray-200 py-5 mb-5"
                    >
                        <div className="sm:grid sm:grid-cols-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            Name
                            </label>
                            <div className="mt-1 sm:mt-0 sm:col-span-3">
                                <input
                                type="text"
                                name="name"
                                autoComplete="off"
                                required
                                defaultValue={data.name}
                                className="rounded-md border border-solid border-gray-300 focus:border-black p-2 w-full focus:outline-none min-w-0 sm:text-sm"
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
                            setSubdomainError(false)
                            e.target.submit.innerHTML = 'Saving...'
                            e.persist()
                            e.preventDefault()
                            mutate(`/api/get-publication-data?siteId=${siteId}`, { ...data, url: e.target.subdomain.value }, false)
                            await fetch(`/api/save-site-subdomain?subdomain=${e.target.subdomain.value}&siteId=${siteId}`).then((res) => {
                                if (!res.ok) {
                                    setSubdomainError(true)
                                }
                            })
                            mutate(`/api/get-publication-data?siteId=${siteId}`)
                            e.target.submit.innerHTML = 'Saved!';
                            setTimeout(function(){
                                e.target.submit.innerHTML = 'Save';
                            }, 3000)
                        }}
                        className="sm:gap-4 sm:items-start sm:border-b sm:border-gray-200 py-5 mb-5"
                    >
                        <div className="sm:grid sm:grid-cols-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            Subdomain
                            </label>
                            <div className="mt-1 sm:mt-0 sm:col-span-3">
                                <div className="max-w-full flex rounded-md">
                                    <input
                                    type="text"
                                    name="subdomain"
                                    autoComplete="off"
                                    required
                                    defaultValue={data.url}
                                    className="flex-1 block p-2 w-full min-w-0 rounded-none rounded-l-md sm:text-sm focus:outline-none border border-solid border-gray-300 focus:border-black"
                                    />
                                    <span className="inline-flex items-center px-3 w-1/3 rounded-r-md border border-l-0 border-r-1 border-t-1 border-b-1 border-gray-300 bg-gray-100 text-gray-600 sm:text-sm">
                                    .{process.env.NEXT_PUBLIC_ROOT_URL}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className={`w-full flex ${subdomainError ? "justify-between" : "justify-end"} mt-3`}>
                        {subdomainError && <p className="text-sm text-red-600 mt-5">This subdomain is taken. Please choose another one.</p>}
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
                            setCustomDomainConflict(false)
                            setDomainDelegated(false)
                            e.target.submit.innerHTML = 'Saving...'
                            e.persist()
                            e.preventDefault()
                            const oldDomain = data.customDomain
                            mutate(`/api/get-publication-data?siteId=${siteId}`, { ...data, customDomain: e.target.customDomain.value }, false)
                            await fetch(`/api/save-custom-domain?domain=${e.target.customDomain.value}&oldDomain=${oldDomain}&siteId=${siteId}`).then((res) => {
                                if (!res.ok) {
                                    e.target.submit.innerHTML = 'Error';
                                    if (res.status == 409) setCustomDomainConflict(true)
                                    if (res.status == 408) {setCustomDomainConflict(true); setDomainDelegated(true)}
                                } else {
                                    e.target.submit.innerHTML = 'Saved!';
                                }
                            })
                            mutate(`/api/get-publication-data?siteId=${siteId}`)
                            setTimeout(function(){
                                e.target.submit.innerHTML = 'Save';
                            }, 3000)
                        }}
                        className="sm:gap-4 sm:items-start sm:border-b sm:border-gray-200 py-5 mb-5"
                    >
                        <div className="sm:grid sm:grid-cols-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                Custom domain 
                                <span className="has-tooltip">
                                    <span className='tooltip rounded shadow-lg p-2 bg-white text-black -mt-16 w-1/4 border border-black'>Note: This can take anywhere between 5-10 minutes to take effect.</span>
                                    <QuestionMarkCircleIcon
                                        className="w-4 h-4 inline-block align-top ml-1"
                                    />
                                </span>
                            </label>
                            <div className="mt-1 sm:mt-0 sm:col-span-3">
                            <div className="max-w-full flex rounded-md">
                                <input
                                type="text"
                                name="customDomain"
                                autoComplete="off"
                                defaultValue={data.customDomain}
                                placeholder="mydomain.com"
                                className="rounded-md border border-solid border-gray-300 focus:border-black p-2 w-full focus:outline-none min-w-0 sm:text-sm"
                                />
                            </div>
                            </div>
                        </div>
                        <div className={`w-full flex ${customDomainConflict ? "justify-between" : "justify-end"} mt-3`}>
                            {customDomainConflict && !domainDelegated && <p className="text-sm text-red-600 mt-2">This custom domain cannot be added because it is currently being used by another Vercel project.</p>}
                            {customDomainConflict && domainDelegated && <p className="text-sm text-red-600 mt-2">This domain is being used by another Vercel project. An email has been sent to the owner of that project to confirm the sharing of domains between both projects. Once the email is received, you can try adding the domain again.</p>}
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
                            await fetch(`/api/save-site-description?description=${e.target.description.value}&siteId=${siteId}`)
                            e.target.submit.innerHTML = 'Saved!';
                            setTimeout(function(){
                                e.target.submit.innerHTML = 'Save';
                            }, 3000)
                        }}
                        className="sm:gap-4 sm:items-start sm:border-gray-200 py-5 mb-5"
                    >
                        <div className="sm:grid sm:grid-cols-4">
                            <label htmlFor="about" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            Description
                            </label>
                            <div className="mt-1 sm:mt-0 sm:col-span-3">
                                <textarea
                                    name="description"
                                    rows={3}
                                    defaultValue={data.description}
                                    placeholder="The hottest gossip about armadilos"
                                    className="rounded-md border border-solid border-gray-300 focus:border-black p-2 w-full focus:outline-none min-w-0 sm:text-sm"
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
            </InnerLayout>
        </Layout>
    )
}