'use client'
import React, { useState } from 'react'
import styles from './styles.module.css'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

const Login = () => {

    const router = useRouter()
    const [form, setForm] = useState<{
        username: string,
        password: string
    }>({ username: '', password: '' })
    const [showCreateAccount, setShowCreateAccount] = useState(false)

    const handleActionBtnClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        try {
            e.preventDefault()
            if (showCreateAccount) {
                let { username, password } = form
                const createAccountRes = await fetch(`${process.env.SERVER_URL}/user/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                })
                const createAccountJson = await createAccountRes.json()
                if (createAccountJson.error) {
                    toast.error(createAccountJson.error.message)
                    return
                }
                setForm((prev) => { return { ...prev, password: '' } })
                setShowCreateAccount(false)
                toast.success(createAccountJson.result.message)
            }
            else {
                let { username, password } = form
                const loginRes = await fetch(`${process.env.SERVER_URL}/user/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                })

                const loginJson = await loginRes.json()
                if (loginJson.error) {
                    toast.error(loginJson.error.message)
                    return
                }
                Cookies.set('token', loginJson.result.token)
                router.push('/')

            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            }
        }
    }

    return (
        <div className={styles.container}>
            {
                showCreateAccount ?
                    <form className={styles.innerContainer}>
                        <h1>Create Account</h1>
                        <div className={styles.formContainer}>
                            <input className={`primaryInp ${styles.usernameInp}`} value={form.username} onChange={(e) => { setForm((prev) => { return { ...prev, username: e.target.value } }) }} placeholder='Enter your username' type="text" />
                            <input className={`primaryInp ${styles.passwordInp}`} value={form.password} onChange={(e) => { setForm((prev) => { return { ...prev, password: e.target.value } }) }} placeholder='Enter your password' type="text" />
                            <button type='submit' className={`primaryBtn ${styles.actionBtn}`} onClick={handleActionBtnClick}>Create Account</button>
                            <p onClick={() => { setShowCreateAccount(false); setForm({ username: '', password: '' }) }} className={styles.createRoomLink}>Already have account?</p>
                        </div>
                    </form> :
                    <form className={styles.innerContainer}>
                        <h1>Login into your account</h1>
                        <div className={styles.formContainer}>
                            <input className={`primaryInp ${styles.usernameInp}`} value={form.username} onChange={(e) => { setForm((prev) => { return { ...prev, username: e.target.value } }) }} placeholder='Enter your username' type="text" />
                            <input className={`primaryInp ${styles.passwordInp}`} value={form.password} onChange={(e) => { setForm((prev) => { return { ...prev, password: e.target.value } }) }} placeholder='Enter your password' type="text" />
                            <button type='submit' className={`primaryBtn ${styles.actionBtn}`} onClick={handleActionBtnClick}>Login</button>
                            <p onClick={(e) => { setShowCreateAccount(true); setForm({ username: '', password: '' }) }} className={styles.createRoomLink}>Create Account</p>
                        </div>
                    </form>
            }
        </div>
    )
}

export default Login