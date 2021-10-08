import Head from 'next/head'
import Link from 'next/link'

export default function Index(props) {
  return (
    <>
      <Head>
        <title>{props.name}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta itemProp="description" content={props.description} />
      </Head>
      <div>
        <h1>{props.name}</h1>
      </div>
      <div>
        <Link href="/">
          <a style={{ marginRight: '10px' }}>Home</a>
        </Link>
        <Link href="/about">
          <a>About</a>
        </Link>
      </div>
      <div>
        <p>More examples:</p>
        <ul>
          <li>
            <a href="https://subdomain-1.vercel.sh">subdomain-1.vercel.sh</a>
          </li>
          <li>
            <a href="https://subdomain-2.vercel.sh">subdomain-2.vercel.sh</a>
          </li>
          <li>
            <a href="https://subdomain-3.vercel.sh">subdomain-3.vercel.sh</a>
          </li>
          <li>
            <a href="https://custom-domain-1.com">custom-domain-1.com</a> (maps
            to <a href="https://subdomain-1.vercel.sh">subdomain-1.vercel.sh</a>
            )
          </li>
        </ul>
      </div>
    </>
  )
}

const mockDB = [
  {
    name: 'Site 1',
    description: 'Subdomain + custom domain',
    subdomain: 'subdomain-1',
    customDomain: 'custom-domain-1.com',
  },
  {
    name: 'Site 2',
    description: 'Subdomain only',
    subdomain: 'subdomain-2',
    customDomain: null,
  },
  {
    name: 'Site 3',
    description: 'Subdomain only',
    subdomain: 'subdomain-3',
    customDomain: null,
  },
]

export async function getStaticPaths() {
  // get all sites that have subdomains set up
  const subdomains = mockDB.filter((item) => item.subdomain)

  // get all sites that have custom domains set up
  const customDomains = mockDB.filter((item) => item.customDomain)

  // build paths for each of the sites in the previous two lists
  const paths = [
    ...subdomains.map((item) => {
      return { params: { site: item.subdomain } }
    }),
    ...customDomains.map((item) => {
      return { params: { site: item.customDomain } }
    }),
  ]
  return {
    paths: paths,
    fallback: 'blocking', // fallback blocking allows sites to be generated using ISR
  }
}

export async function getStaticProps({ params: { site } }) {
  // check if site is a custom domain or a subdomain
  const customDomain = site.includes('.') ? true : false

  // fetch data from mock database using the site value as the key
  const data = mockDB.filter((item) =>
    customDomain ? item.customDomain == site : item.subdomain == site
  )

  return {
    props: { ...data[0] },
    revalidate: 10, // set revalidate interval of 10s
  }
}
