import Claim from "@/components/sites/Claim"

export default function Custom404(props) {
  
    return (
        <Claim subdomain={props.subdomain}/>
    )
}

export async function getStaticProps({ params: {site} }) {
    return { 
        props: {
            subdomain: site,
        },
        revalidate: 10
    }
}