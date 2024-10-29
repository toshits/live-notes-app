'use client'
import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import jwt from 'jsonwebtoken'
import Cookies from 'js-cookie'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const Navbar = () => {

    const router = useRouter()
    const pathname = usePathname()

    const [token, setToken] = useState<string | null>()

    useEffect(() => {
        const token = Cookies.get('token')
        if (token) setToken(token)
        else setToken(null)
    }, [pathname])

    if(token){
        return (
            <div>
                <div className={styles.container}>
                    <div></div>
                    <div>
                        <p className={styles.logoutBtn} onClick={() => {
                            Cookies.remove('token')
                            router.push('/login')
                        }}>Logout</p>
                    </div>
                </div>
            </div>
        )
    }
    else{
        return <></>
    }

}

export default Navbar