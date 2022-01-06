import { signIn, signOut, useSession } from "next-auth/react"

export default function Home() {
  const { data, status } = useSession()

  if (status === "authenticated") {
    return (
      <div>
        Welcome {data.user.name}!{" "}
        <button
          onClick={(e) => {
            e.preventDefault()
            signOut()
          }}
        >
          Sign out
        </button>
        <ul>
          <li>
            <a href="https://sub1.subdomain-auth.com">
              sub1.subdomain-auth.com
            </a>
          </li>
          <li>
            <a href="https://subdomain-auth.com">subdomain-auth.com</a>
          </li>
        </ul>
      </div>
    )
  } else if (status === "loading") {
    return <div>Loading...</div>
  }
  return (
    <div>
      <button
        onClick={(e) => {
          e.preventDefault()
          signIn("github")
        }}
      >
        Sign in with GitHub
      </button>
    </div>
  )
}
