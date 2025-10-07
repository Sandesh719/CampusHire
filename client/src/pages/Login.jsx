import React, { useEffect, useState } from 'react'
import { MetaData } from '../components/MetaData'
import { AiOutlineMail, AiOutlineUnlock, AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom'
import { TbLoader2 } from 'react-icons/tb'
import { loginUser } from '../actions/UserActions'
import { useDispatch, useSelector } from 'react-redux'

export const Login = () => {
  const { loading, isLogin } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [eyeTog, setEyeTog] = useState(false)
  const [role, setRole] = useState("student") // default role selection

  const loginHandler = (e) => {
    e.preventDefault()
    if (!email || !password) return
    const data = { email, password, role }
    dispatch(loginUser(data))
    setEmail("")
    setPassword("")
  }

  useEffect(() => {
    if (isLogin) {
      navigate("/")
    }
  }, [isLogin, navigate])

  return (
    <>
      <MetaData title="Login" />
      <div className='bg-gray-950 min-h-screen pt-14 md:px-20 px-3 text-white'>
        <div className='flex justify-center w-full items-start pt-14'>
          <form onSubmit={loginHandler} className='flex flex-col md:w-1/3 shadow-gray-700 w-full md:mx-0 mx-8'>
            <div className='md:px-10 px-2 py-6 w-full flex flex-col gap-4'>
              <div className='text-center'>
                <p className='text-4xl font-medium'>Login</p>
              </div>

              <div className='bg-white flex justify-center items-center'>
                <div className='text-gray-600 px-2'>
                  <AiOutlineMail size={20} />
                </div>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                  placeholder='Email'
                  type="text"
                  className='outline-none bold-placeholder w-full text-black px-1 pr-3 py-2'
                />
              </div>

              <div className='bg-white flex justify-center items-center'>
                <div className='text-gray-600 px-2'>
                  <AiOutlineUnlock size={20} />
                </div>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                  placeholder='Password'
                  type={eyeTog ? "text" : "password"}
                  className='outline-none bold-placeholder w-full text-black px-1 pr-3 py-2'
                />
                <div className='text-gray-600 px-2 cursor-pointer'>
                  {eyeTog
                    ? <AiOutlineEye size={20} onClick={() => setEyeTog(!eyeTog)} />
                    : <AiOutlineEyeInvisible size={20} onClick={() => setEyeTog(!eyeTog)} />}
                </div>
              </div>

              {/* --- Role Selector --- */}
              <div className='flex justify-between text-sm px-1 mt-1'>
                <label className='flex items-center gap-1'>
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={role === "student"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Student
                </label>
                <label className='flex items-center gap-1'>
                  <input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={role === "recruiter"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Recruiter
                </label>
              </div>

              <div>
                <button
                  disabled={loading || !email || !password}
                  className='blueCol px-8 w-full py-2 flex justify-center items-center font-semibold'
                >
                  {loading ? <TbLoader2 className='animate-spin' size={24} /> : "Login"}
                </button>
              </div>

              <div className='text-center text-sm pt-2'>
                <p>Don&apos;t have an account?{" "}
                  <Link to="/register" className='text-yellow-400 underline'>Register</Link> here.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}