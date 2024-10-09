
"use client"

import React, { createContext, useContext } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type ToastContextType = {
    showError: (title: string, description?: string) => void;
    showSuccess: (title: string, description?: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: any) => {

    enum StatusContentToast {
        SUCCESS,
        ERROR
    }
    const ContentToast = ({ closeToast, title, status, description }: any) => {
        return (
            <div className={`flex items-start gap-4 p-4 border border-solid ${status===StatusContentToast.ERROR  ? "bg-Error-25 border border-Error-300" : "bg-Success-25 border-Success-300"} rounded-lg shadow-sm w-full`}>
                <div className='flex flex-start justify-between w-full'>
                    {/* <Icon className='' icon={status===StatusContentToast.ERROR ? "toast-error" : "toast-success"}/> */}
                    <div className='flex items-center justify-between w-full'>
                        <div className='ml-4 w-full flex items-start justify-between'>
                            <div className='w-full'>
                                <span className={`block w-full font-inter text-sm font-semibold leading-5 ${status===StatusContentToast.ERROR ? "text-Error-700" : "text-Success-700"}`}>{title}</span>
                                {
                                    description ?
                                    <span className={`block mt-1 font-inter text-sm font-normal leading-5 ${status===StatusContentToast.ERROR ? "text-Error-700" : "text-Success-700"}`}>{description}</span>
                                    : null
                                }
                            </div>
                            <button className="bg-transparent outline-none m-0 p-0"
                                onClick={closeToast}>
                                {/* <Icon icon="x-close" stroke={status===StatusContentToast.ERROR ? "#F04438" : "#17B26A"} classNameIcon="w-6 h-6" /> */}
                            </button>
                        </div>                    
                    </div>
                </div>
            </div>
        )
    }

    const showError = (title: string, description?: string) => toast.error(title)
    const showSuccess = (title: string, description?: string) => toast.success(title)

    return (
        <ToastContext.Provider value={{ showError, showSuccess }}>
            {children}
            <ToastContainer stacked hideProgressBar/>
        </ToastContext.Provider>
    )
}


export const useToast = () => useContext(ToastContext)