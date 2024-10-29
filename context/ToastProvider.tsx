'use client'
import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const ToastProvider = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <>
            {children}
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
        </>
    )
}

export default ToastProvider