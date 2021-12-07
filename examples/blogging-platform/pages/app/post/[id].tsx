import Layout from '../../../components/app/Layout'
import useSWR from 'swr'
import Link from 'next/link'
import { useState, useEffect, useRef} from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import { AnnotationIcon, PaperClipIcon, PencilIcon, TrashIcon } from '@heroicons/react/solid'
import {useRouter} from 'next/router'

const fetcher = (...args) => fetch(...args).then(res => res.json())
  
export default function Post ({postId}) {

    const { data } = useSWR(`/api/get-post-data?postId=${postId}`, fetcher, {initialData: { post: {
        updatedAt: '2021-06-26T22:39:53.071Z',
        title: '',
        description: '',
        content: '',
        Site: {
            id: ''
        }
    }}, revalidateOnMount: true,
    })

    const [savedState, setSavedState] = useState(`Last save ${Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(data.post.updatedAt))} ${Intl.DateTimeFormat('en', { day: '2-digit' }).format(new Date(data.post.updatedAt))} at ${Intl.DateTimeFormat('en', { hour: 'numeric', minute: 'numeric' }).format(new Date(data.post.updatedAt))}`)
    const [title, setTitle] = useState(data.title)
    const [description, setDescription] = useState(data.description)
    const [content, setContent] = useState(data.content)
    const [publishing, setPublishing] = useState(false)
    const firstRender = useRef(false);

    useEffect(() => {
        const clickedSave = (e) => {
            let charCode = String.fromCharCode(e.which).toLowerCase();
            if ((e.ctrlKey || e.metaKey) && charCode === 's') {
                e.preventDefault()
                saveChanges(title, description, content)
            }
        }
        window.addEventListener("keydown", clickedSave)
        return () => {
            window.removeEventListener('keydown', clickedSave)
        }
    }, [title, description, content])

    useEffect(() => {
        if (firstRender.current) {
            setSavedState("Unsaved changes")
            let timer = setTimeout(() => {
                saveChanges(title, description, content)
            }, 3000);
            return () => {
                clearTimeout(timer);
            };
        } else {
            firstRender.current = true;
        }
    }, [title, description, content])

    async function saveChanges(title, description, content) {
        setSavedState("Saving changes...")
        const response = await fetch('/api/save-post', {
            method: 'POST', 
            body: JSON.stringify({id: postId, title: title, description: description, content: content})
        })
        if (response.ok) {
            const data = await response.json()
            setSavedState(`Last save ${Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(data.updatedAt))} ${Intl.DateTimeFormat('en', { day: '2-digit' }).format(new Date(data.updatedAt))} at ${Intl.DateTimeFormat('en', { hour: 'numeric', minute: 'numeric' }).format(new Date(data.updatedAt))}`)
        } else {
            setSavedState("Failed to save.")
        }
    }

    const router = useRouter()

    const publish = async (siteId, postId, rootUrl, title, description, content) => {
        await saveChanges(title, description, content)
        const response = await fetch(`/api/publish-post?siteId=${siteId}&postId=${postId}`, {
            method: 'POST',
        })
        const responseData = await response.json()
        router.push(`https://${responseData.siteUrl}.${rootUrl}/p/${responseData.slug}`)
    }

    return (
        <>
            <Layout>
                <div className="w-6/12 mx-auto mt-10 mb-16">
                    <Link href={`/site/${data ? data.post.Site.id: ''}`}>
                        <a className="text-left text-gray-800 font-semibold text-lg">
                            ← Back to All Posts
                        </a>
                    </Link>

                    <TextareaAutosize
                        name="title"
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-2 py-4 border-none text-gray-800 mt-6 text-4xl font-bold resize-none focus:outline-none"
                        placeholder="Enter post title..."
                        defaultValue={data.post.title}
                    />
                    <TextareaAutosize
                        name="description"
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-2 py-3 border-none text-gray-600 text-xl mb-3 resize-none focus:outline-none"
                        placeholder="Enter post description..."
                        defaultValue={data.post.description}
                    />
                    
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="relative z-0 inline-flex shadow-sm rounded-md -space-x-px">
                            <button
                                type="button"
                                className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-400 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <span className="sr-only">Edit</span>
                                <PencilIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-400 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <span className="sr-only">Attachment</span>
                                <PaperClipIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-400 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <span className="sr-only">Annotate</span>
                                <AnnotationIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-400 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <span className="sr-only">Delete</span>
                                <TrashIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                            </span>
                        </div>
                    </div>
                    <TextareaAutosize
                        name="content"
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full px-2 py-3 border-none text-gray-800 text-lg mb-5 resize-none focus:outline-none"
                        placeholder="Write some content here..."
                        defaultValue={data.post.content}
                    />
                </div>
                <footer className="h-20 z-5 fixed bottom-0 inset-x-0 border-solid border-t border-gray-500 bg-white">
                    <div className="w-6/12 mx-auto mt-3 flex justify-between">
                        <div className="text-sm mt-1">
                            <strong><p>{data && data.post.published? "Published" : "Draft"}</p></strong>
                            <p>{savedState}</p>
                        </div>
                        <div>
                            <Link href={`/post/${postId}/settings`}>
                                <a className="text-lg mx-2">
                                    Settings
                                </a>
                            </Link>
                            <button 
                                onClick={()=> {publish(data.post.Site.id, postId, process.env.NEXT_PUBLIC_ROOT_URL, title, description, content); setPublishing(true)}}
                                className="mx-2 rounded-md py-3 px-6 bg-blue-500 hover:bg-blue-400 active:bg-blue-300 focus:outline-none text-lg text-white"
                            >
                                Publish
                                { publishing ? 
                                <svg
                                className="animate-spin ml-2 h-4 w-4 text-white inline-block"
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
                                : "  →"}
                            </button>
                        </div>
                    </div>
                </footer>
            </Layout>
        </>
    )
}

export async function getServerSideProps(ctx) {

    const { id } = ctx.query;  
    return {
        props: {
            postId: id,
        }
    }
}