import Layout from '../../../../components/app/Layout'
import Link from "next/link"
import { useState } from 'react'
import prisma from '../../../../lib/prisma'

export default function PostSettings(props){

    const [slugError, setSlugError] = useState(false)
    
    return (
        <>
            <Layout>
                <div className="pt-10 w-10/12 sm:w-1/2 m-auto">
                    <Link href={`/post/${props.postId}`}>
                        <a className="text-left text-gray-800 font-semibold text-lg">
                            ← Back to Post
                        </a>
                    </Link>
                    <div className="flex justify-between mt-10">
                        <h1 className="font-bold text-2xl sm:text-4xl mb-10">
                            Post Settings
                        </h1>
                    </div>
                    
                    <form
                        onSubmit={async (e) => {
                            setSlugError(false)
                            e.target.submit.innerHTML = 'Saving...'
                            e.persist()
                            e.preventDefault()
                            await fetch(`/api/save-post-slug?postId=${props.postId}&slug=${e.target.slug.value}`).then((res) => {
                                if (!res.ok) {
                                    setSlugError(true)
                                }
                            })
                            e.target.submit.innerHTML = 'Save'
                        }}
                        className="sm:gap-4 sm:items-start sm:border-b sm:border-gray-200 py-5 mb-5"
                    >
                        <div className="sm:grid sm:grid-cols-4">
                            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            Post Slug
                            </label>
                            
                            <div className="mt-1 sm:mt-0 sm:col-span-3">
                                <input
                                type="text"
                                name="slug"
                                autoComplete="off"
                                required
                                defaultValue={props.postData[0].slug}
                                className="rounded-md border border-solid border-gray-300 p-2 w-full focus:outline-none min-w-0 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div className={`w-full flex ${slugError ? "justify-between" : "justify-end"} mt-3`}>
                            {slugError && <p className="text-sm text-red-600 mt-5">This slug is already in use. Please pick another one.</p>}
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
            </Layout>
        </>
    )
}

export async function getServerSideProps(ctx) {

    const { id } = ctx.query; 
    const postData = await prisma.post.findMany({
        where: {
            id: id
        },
        select: {
            slug: true,
            image: true
        }
    })
    return {
        props: {
            postData: postData,
            postId: id,
        }
    }
}