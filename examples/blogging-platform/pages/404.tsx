import Claim from "@/components/sites/Claim"
import{ useEffect, useState } from "react"

export default function Custom404() {

    const [subdomain, setSubdomain] = useState("test")
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const host = window.location.hostname
            setSubdomain(host)
        }
    }, [])
    
    return (
        <Claim subdomain={subdomain}/>
    )
}