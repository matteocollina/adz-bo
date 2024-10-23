"use client"
import Image from 'next/image'
import { useState } from 'react'
import { Formik } from 'formik';
import axios from 'axios';
import { useToast } from '../components/Toast';
import { useRouter } from 'next/compat/router'

export default function Login() {
	const toast = useToast();
  const router = useRouter()
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            alt="Adz logo"
            src={"/assets/images/logo (1).png"}
            className="mx-auto"
            width={200}
            height={150}
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Formik
            initialValues={{ email: '', password: '' }}
            validate={values => {
              const errors:any = {};
              if (!values.email) {
                errors.email = 'Required';
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = 'Invalid email address';
              }

              if (!values.password) {
                errors.password = 'Required';
              }
              return errors;
            }}
            onSubmit={async(values, { setSubmitting }) => {
              try {
                setSubmitting(true)
                await axios.post(`/api/auth/login`,values)
                toast.showSuccess("Welcome back!");
                router.push("/dashboard")
              } catch (error) {
                toast.showError("Invalid credentials");
              }finally {
                setSubmitting(false)
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              /* and other goodies */
            }) => (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <p className='text-xs text-red-600'>{errors.email && touched.email && errors.email}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                      Password
                    </label>
                    {/* <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div> */}
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      autoComplete="current-password"
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    />
                    <p className='text-xs text-red-600'>{errors.password && touched.password && errors.password}</p>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            )}
          </Formik>
{/* 
          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Start a 14 day free trial
            </a>
          </p> */}
        </div>
      </div>
    </>
  )
}
