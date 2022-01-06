import type { AppProps } from "next/app"
// import type { LayoutProps } from "@vercel/edge-functions-ui/layout"
// import { getLayout } from "@vercel/edge-functions-ui"
// import "@vercel/edge-functions-ui/globals.css"
import { SessionProvider } from "next-auth/react"

export default function MyApp({ Component, pageProps }: AppProps) {
  // const Layout = getLayout<LayoutProps>(Component)

  return (
    <SessionProvider>
      {/* <Layout path="simple-example" deployButton={{ env: ["ROOT_URL"] }}> */}
      <Component {...pageProps} />
      {/* </Layout> */}
    </SessionProvider>
  )
}
