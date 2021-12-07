import { AppProps } from 'next/app'
import '../styles/global.css';
import { Provider } from 'next-auth/client'

const App = ({ Component, pageProps }: AppProps) => {

  return (
    <>
      <Provider 
        options={{
          clientMaxAge: 3600*24*7,
          keepAlive: 3600*24*7
        }}
        session={pageProps.session}
      >
        <Component {...pageProps} />
      </Provider>
    </>
  )
}

export default App