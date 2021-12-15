import Head from 'next/head'
import Header from './Header'

export default function Layout ({subdomain, siteName, pageTitle, description, logo, thumbnail, children}) {
  return (
    <>
    <div>  
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
        <meta itemProp="image" content={thumbnail}/>
        <meta name="description" content={description}/>
        <meta property="og:title" content={pageTitle}/>
        <meta property="og:description" content={description}/>
        <meta property="og:image" content={thumbnail}/>
        <meta property="og:type" content="website"/>

        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:site" content="@Elegance" />
        <meta name="twitter:creator" content="@StevenTey"/>
        <meta name="twitter:title" content={pageTitle}/>
        <meta name="twitter:description" content={description}/>
        <meta name="twitter:image" content={thumbnail}/>
      </Head>
      <Header 
        subdomain={subdomain}
        name={siteName}
        logo={logo}
      />
      <div className="pt-20">
        {children}
      </div>
    </div>
    </>
  )
}