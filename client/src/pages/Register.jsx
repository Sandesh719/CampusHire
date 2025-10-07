/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail, AiOutlineUnlock } from 'react-icons/ai'
import { BsFileEarmarkText } from 'react-icons/bs'
import { CgProfile } from 'react-icons/cg'
import { MdOutlineFeaturedPlayList, MdPermIdentity } from 'react-icons/md'
import { TbLoader2 } from 'react-icons/tb'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../actions/UserActions'
import { MetaData } from '../components/MetaData'

export const Register = () => {
  const { loading, isLogin } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [eyeTog, setEyeTog] = useState(false)

  const [role, setRole] = useState('student') // default student
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [skills, setSkills] = useState("")

  // student fields
  const [college, setCollege] = useState("")
  const [year, setYear] = useState("1")

  // recruiter fields
  const [companyName, setCompanyName] = useState("")
  const [companyDescription, setCompanyDescription] = useState("")

  // files
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarName, setAvatarName] = useState("")
  const [resumeFile, setResumeFile] = useState(null)
  const [resumeName, setResumeName] = useState("")

  const avatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image for avatar')
      return
    }
    setAvatarFile(file)
    setAvatarName(file.name)
  }

  const resumeChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!file.type.startsWith('image/') && !allowed.includes(file.type)) {
      alert('Please upload PDF / DOC / DOCX or image for resume')
      return
    }
    setResumeFile(file)
    setResumeName(file.name)
  }

  const registerHandler = (e) => {
    e.preventDefault()

    if (!name || !email || !password) {
      return alert('Please fill name, email and password')
    }
    if (role === 'student' && !college) {
      return alert('Please enter your college')
    }
    if (role === 'recruiter' && !companyName) {
      return alert('Please enter company name')
    }

    // Build FormData
    const uploadData = new FormData()
    uploadData.append('role', role)
    uploadData.append('name', name)
    uploadData.append('email', email)
    uploadData.append('password', password)
    uploadData.append('skills', skills)

    if (role === 'student') {
      uploadData.append('college', college)
      uploadData.append('year', year)
      if (resumeFile) uploadData.append('resume', resumeFile)
    }

    if (role === 'recruiter') {
      uploadData.append('companyName', companyName)
      uploadData.append('companyDescription', companyDescription)
    }

    if (avatarFile) uploadData.append('avatar', avatarFile)
    dispatch(registerUser(uploadData))
  }

  useEffect(() => {
    if (isLogin) navigate("/")
  }, [isLogin])

  return (
    <>
      <MetaData title="Register" />
      <div className='bg-gray-950 min-h-screen pt-14 md:px-20 px-3 text-white'>
        <div className='flex justify-center w-full items-start pt-6'>
          <form onSubmit={registerHandler} className='flex flex-col md:w-1/3 shadow-gray-700 w-full md:mx-0 mx-8'>
            <div className='md:px-10 px-2 pt-4 pb-20 w-full flex flex-col gap-4'>
              <div className='text-center'>
                <p className='text-4xl font-medium'>Register</p>
              </div>

              {/* Role selector */}
              <div className='flex gap-2'>
                <button
                  type='button'
                  className={`px-3 py-1 rounded ${role === 'student' ? 'bg-yellow-400 text-black' : 'bg-white text-black'}`}
                  onClick={() => setRole('student')}
                >
                  Student
                </button>
                <button
                  type='button'
                  className={`px-3 py-1 rounded ${role === 'recruiter' ? 'bg-yellow-400 text-black' : 'bg-white text-black'}`}
                  onClick={() => setRole('recruiter')}
                >
                  Recruiter
                </button>
              </div>

              {/* Name */}
              <div className='bg-white flex justify-center items-center'>
                <div className='text-gray-600 px-2'>
                  <MdPermIdentity size={20} />
                </div>
                <input value={name} onChange={(e) => setName(e.target.value)} required placeholder='Full name' type="text" className='outline-none bold-placeholder w-full text-black px-1 pr-3 py-2' />
              </div>

              {/* Mail */}
              <div className='bg-white flex justify-center items-center'>
                <div className='text-gray-600 px-2'>
                  <AiOutlineMail size={20} />
                </div>
                <input value={email} autoComplete='current-password' onChange={(e) => setEmail(e.target.value)} required placeholder='Email' type="email" className='outline-none bold-placeholder w-full text-black px-1 pr-3 py-2' />
              </div>

              {/* Password */}
              <div className='bg-white flex justify-center items-center'>
                <div className='text-gray-600 px-2'>
                  <AiOutlineUnlock size={20} />
                </div>
                <input value={password} onChange={(e) => setPassword(e.target.value)} required placeholder='Password' type={eyeTog ? "text" : "password"} className='outline-none bold-placeholder w-full text-black px-1 pr-3 py-2' />
                <div className='text-gray-600 px-2 cursor-pointer' >
                  {eyeTog
                    ? <AiOutlineEye size={20} onClick={() => setEyeTog(!eyeTog)} />
                    : <AiOutlineEyeInvisible size={20} onClick={() => setEyeTog(!eyeTog)} />}
                </div>
              </div>

              {/* Student fields */}
              {role === 'student' && (
                <>
                  <div className='bg-white flex justify-center items-center'>
                    <input value={college} onChange={(e) => setCollege(e.target.value)} required placeholder='College / Institute' type="text" className='outline-none bold-placeholder w-full text-black px-1 pr-3 py-2' />
                  </div>
                  <div className='bg-white flex justify-center items-center'>
                    <select value={year} onChange={(e) => setYear(e.target.value)} className='outline-none bold-placeholder w-full text-black px-1 pr-3 py-2'>
                      <option value="1">Year 1</option>
                      <option value="2">Year 2</option>
                      <option value="3">Year 3</option>
                      <option value="4">Year 4</option>
                    </select>
                  </div>

                  {/* Resume */}
                  <div>
                    <div className='bg-white flex justify-center items-center'>
                      <div className='text-gray-600 px-2'>
                        <BsFileEarmarkText size={20} />
                      </div>
                      <label className='outline-none w-full text-black px-1 pr-3 py-2' htmlFor="resume">
                        {resumeName ? resumeName : <span className='text-gray-500 cursor-pointer font-medium'>Select Resume (PDF/DOC/Image)...</span>}
                      </label>
                      <input
                        onChange={resumeChange}
                        placeholder='Resume' id='resume' name='resume'
                        accept=".pdf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                        type="file"
                        className='outline-none hidden w-full text-black px-1 pr-3 py-2' />
                    </div>
                    <p className='bg-gray-950 text-white text-xs'>Resume (optional)</p>
                  </div>

                  {/* Skills */}
                  <div className='bg-white flex justify-center items-center'>
                    <div className='text-gray-600 md:pb-12 pb-8 px-2'>
                      <MdOutlineFeaturedPlayList size={20} />
                    </div>
                    <textarea value={skills} onChange={(e) => setSkills(e.target.value)} placeholder='Skills (comma separated)' type="text" className='outline-none w-full text-black bold-placeholder px-1 pr-3 py-2' />
                  </div>
                </>
              )}

              {/* Recruiter fields */}
              {role === 'recruiter' && (
                <>
                  <div className='bg-white flex justify-center items-center'>
                    <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} required placeholder='Company / Organization name' type="text" className='outline-none bold-placeholder w-full text-black px-1 pr-3 py-2' />
                  </div>
                  <div className='bg-white flex justify-center items-center'>
                    <textarea value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} placeholder='Short company description (optional)' className='outline-none w-full text-black px-1 pr-3 py-2' />
                  </div>
                </>
              )}

              {/* Profile Avatar */}
              <div>
                <div className='bg-white flex justify-center items-center'>
                  <div className='text-gray-600 px-2'>
                    {avatarFile
                      ? <img src={URL.createObjectURL(avatarFile)} alt='avatar-preview' className='w-[3em] h-[2.5em] object-cover rounded' />
                      : <CgProfile size={20} />}
                  </div>
                  <label htmlFor='avatar' className='outline-none w-full cursor-pointer text-black px-1 pr-3 py-2 '>
                    {avatarName ? avatarName : <span className='text-gray-500 font-medium'>Select Profile Pic (optional)...</span>}
                  </label>
                  <input
                    id='avatar' name='avatar'
                    onChange={avatarChange}
                    accept="image/*"
                    type="file"
                    className='outline-none w-full hidden text-black px-1 pr-3 py-2'
                  />
                </div>
                <p className='bg-gray-950 text-white text-xs'>Profile image (optional)</p>
              </div>

              <div>
                <button disabled={loading} className='blueCol flex justify-center items-center px-8 w-full py-2 font-semibold'>
                  {loading ? <TbLoader2 className='animate-spin' size={24} /> : "Register"}
                </button>
              </div>

              <div className='text-center text-sm pt-2'>
                <p>Already have an account, <Link to="/login" className='text-yellow-400 underline'>Login</Link> here. </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}