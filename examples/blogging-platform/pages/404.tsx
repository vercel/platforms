import Claim from "@/components/sites/Claim"
import{ useEffect, useState } from "react"

export default function Custom404() {

    const [subdomain, setSubdomain] = useState("")
    
    useEffect(() => {
        const host = window.location.hostname
        setSubdomain(host)
    }, [])
    
    return (
        <Claim subdomain={subdomain}/>
    )
}