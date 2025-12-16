import React, { useContext, useState } from 'react'
import { FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import Context from '../context'

const AdminLogin = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [data, setData] = useState({
        email: "",
        password: ""
    })
    const navigate = useNavigate()
    const { fetchUserDetails } = useContext(Context)

    const handleOnChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const dataResponse = await fetch(SummaryApi.adminSignIn.url, {
            method: SummaryApi.adminSignIn.method,
            credentials: 'include',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        })

        const dataApi = await dataResponse.json()

        if (dataApi.success) {
            toast.success(dataApi.message)
            await fetchUserDetails()
            navigate('/')
        }

        if (dataApi.error) {
            toast.error(dataApi.message)
        }
    }

    return (
        <section id='login' className='min-h-screen flex items-center justify-center bg-gradient-to-br from-accent-900 via-accent-800 to-primary-700 py-16'>
            <div className='mx-auto container p-4'>
                <div className='bg-white p-8 w-full max-w-md mx-auto rounded-2xl shadow-2xl'>
                    <div className='text-center mb-8'>
                        <div className='w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-accent-700 rounded-full flex items-center justify-center'>
                            <FaShieldAlt className='text-4xl text-white' />
                        </div>
                        <h1 className='text-3xl font-bold text-accent-800 mb-2'>Staff Login</h1>
                        <p className='text-gray-600'>Admin and staff access only</p>
                    </div>

                    <form className='pt-6 flex flex-col gap-4' onSubmit={handleSubmit}>
                        <div className='grid'>
                            <label className='text-sm font-medium text-gray-700 mb-2'>Email</label>
                            <div className='bg-slate-100 p-3 rounded-lg'>
                                <input
                                    type='email'
                                    placeholder='admin@example.com'
                                    name='email'
                                    value={data.email}
                                    onChange={handleOnChange}
                                    className='w-full h-full outline-none bg-transparent'
                                    required
                                />
                            </div>
                        </div>

                        <div className=''>
                            <label className='text-sm font-medium text-gray-700 mb-2 block'>Password</label>
                            <div className='bg-slate-100 p-3 flex items-center rounded-lg'>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder='Enter your password'
                                    value={data.password}
                                    name='password'
                                    onChange={handleOnChange}
                                    className='w-full h-full outline-none bg-transparent'
                                    required
                                />
                                <div className='cursor-pointer text-xl text-gray-600' onClick={() => setShowPassword((preve) => !preve)}>
                                    <span>
                                        {
                                            showPassword ? (
                                                <FaEyeSlash />
                                            )
                                                :
                                                (
                                                    <FaEye />
                                                )
                                        }
                                    </span>
                                </div>
                            </div>
                            <Link to={'/forgot-password'} className='block w-fit ml-auto hover:underline hover:text-primary-600 text-sm mt-2 text-gray-600'>
                                Forgot password?
                            </Link>
                        </div>

                        <button className='bg-gradient-to-r from-primary-500 to-accent-700 hover:from-primary-600 hover:to-accent-800 text-white px-6 py-3 w-full rounded-lg hover:scale-105 transition-all mt-4 font-semibold shadow-lg'>
                            Login
                        </button>
                    </form>

                    <div className='mt-8 text-center border-t pt-6'>
                        <p className='text-sm text-gray-600'>
                            This login is for authorized staff only.
                        </p>
                        <Link to='/' className='text-primary-600 hover:text-primary-700 font-medium text-sm hover:underline mt-2 inline-block'>
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AdminLogin
