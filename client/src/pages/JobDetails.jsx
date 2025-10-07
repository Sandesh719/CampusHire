import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { MetaData } from '../components/MetaData'
import { Loader } from '../components/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { getSingleJob, saveJob } from '../actions/JobActions'
import { BiBriefcase, BiBuildings, BiRupee } from 'react-icons/bi'
import { AiOutlineSave } from 'react-icons/ai'
import { HiStatusOnline } from 'react-icons/hi'
import { BsPersonWorkspace, BsSend } from 'react-icons/bs'
import { TbLoader2 } from 'react-icons/tb'
import { toast } from 'react-toastify'

export const JobDetails = () => {
  const dispatch = useDispatch()
  const { id } = useParams()
  const navigate = useNavigate()

  const { jobDetails, loading, saveJobLoading } = useSelector((state) => state.job)
  const { me, isLogin } = useSelector((state) => state.user)

  const job = jobDetails

  useEffect(() => {
    dispatch(getSingleJob(id))
  }, [dispatch, id])

  const convertDateFormat = (inputDate) => {
    const parts = inputDate.split('-')
    if (parts.length !== 3) return 'Invalid date format'

    const [year, month, day] = parts
    return `${day}-${month}-${year}`
  }

  const saveJobHandler = () => {
    dispatch(saveJob(id))
  }

  const notLoginHandler = (actionText) => {
    if (!isLogin) {
      toast.info(`Please login to ${actionText} a gig`)
      navigate('/login')
    }
  }

  return (
    <>
      <MetaData title="Gig Details" />
      <div className="bg-gray-950 min-h-screen pt-14 md:px-20 text-white">
        {loading ? (
          <Loader />
        ) : (
          <>
            {job && (
              <div>
                <div className="flex pt-5 md:px-12 pl-4 md:gap-10 gap-5">
                  <div className="flex items-center w-[6rem]">
                    {job.companyLogo?.url && (
                      <img src={job.companyLogo.url} alt="company logo" />
                    )}
                  </div>

                  <div className="flex flex-col gap-2 md:pt-2">
                    <p className="text-xl flex gap-1 items-center md:text-3xl">
                      <BiBriefcase /> {job.title}
                    </p>
                    <p className="text-lg flex gap-1 items-center md:text-2xl">
                      <BiBuildings /> {job.companyName}
                    </p>
                    <p className="text-lg flex gap-2 items-center md:text-2xl">
                      <BsPersonWorkspace size={20} /> {job.employmentType}
                    </p>
                    <p className="text-lg flex gap-1.5 items-center md:text-2xl">
                      <HiStatusOnline size={20} />
                      <span
                        className={`${
                          job.status === 'active'
                            ? 'text-green-700'
                            : 'text-red-500'
                        } w-20 text-center rounded-lg font-semibold`}
                      >
                        {job.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="border-b pt-2 pb-3 md:mx-12 mx-4"></div>

                <div className="md:px-12 pl-4">
                  <p className="text-2xl py-3">Details:</p>
                  <ul className="flex flex-col gap-3">
                    <li className="flex items-center gap-3">
                      Posted By:
                      <div>{job.postedBy?.name}</div>
                    </li>
                    <li className="flex items-center gap-3">
                      Posted At:
                      <div>
                        {job.createdAt
                          ? convertDateFormat(job.createdAt.substr(0, 10))
                          : '--'}
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      Location: <div>{job.location || 'Remote'}</div>
                    </li>
                    <li className="flex items-center gap-3">
                      Pay Range:
                      <div className="flex items-center">
                        <BiRupee />
                        <span>
                          {job.payMin && job.payMax
                            ? `${job.payMin} - ${job.payMax}`
                            : job.payMin
                            ? job.payMin
                            : 'N/A'}{' '}
                          {job.payType === 'stipend'
                            ? 'Stipend'
                            : job.payType === 'hourly'
                            ? '/hour'
                            : '/project'}
                        </span>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      Duration:
                      <div>
                        {job.durationWeeks
                          ? `${job.durationWeeks} week${
                              job.durationWeeks > 1 ? 's' : ''
                            }`
                          : 'Not specified'}
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      Experience:
                      <div>{job.experience || 'No experience required'}</div>
                    </li>
                    {job.skillsRequired?.length > 0 && (
                      <li className="flex items-center gap-3">
                        Skills Required:
                        <div className="flex flex-wrap items-center gap-3">
                          {job.skillsRequired.map((s, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-yellow-600 rounded text-black md:text-sm font-semibold text-xs"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </li>
                    )}
                    <li className="grid gap-2 pt-2">
                      <div className="text-2xl">Description:</div>
                      <div>{job.description}</div>
                    </li>
                  </ul>
                </div>

                {/* ---- Action Buttons ---- */}
                <div className="md:px-12 pl-4 flex gap-8 pb-32 pt-6">
                  {/* Apply Button */}
                  <button
                    onClick={() => {
                      if (!isLogin) {
                        notLoginHandler('apply')
                        return
                      }
                      if (me?.role === 'recruiter') {
                        toast.info('Recruiters cannot apply for gigs.')
                        return
                      }
                      if (me?.appliedJobs?.includes(job?._id)) {
                        toast.error('You have already applied!')
                        return
                      }
                      navigate(`/Application/${job?._id}`)
                    }}
                    className="hover:bg-green-600 md:text-lg text-sm font-bold px-10 py-1.5 bg-green-800 flex items-center gap-1"
                    disabled={
                      me?.role === 'recruiter' || me?.appliedJobs?.includes(job?._id)
                    }
                  >
                    <BsSend />{' '}
                    {me?.appliedJobs?.includes(job?._id) ? 'Applied' : 'Apply'}
                  </button>

                  {/* Save Button */}
                  <button
                    onClick={() => {
                      if (isLogin) saveJobHandler()
                      else notLoginHandler('save')
                    }}
                    className="hover:bg-blue-600 md:text-lg text-sm font-bold px-10 py-1.5 bg-blue-800 flex items-center gap-1"
                  >
                    {saveJobLoading ? (
                      <span className="animate-spin px-5">
                        <TbLoader2 size={20} />
                      </span>
                    ) : (
                      <>
                        <AiOutlineSave />
                        {me?.savedJobs?.includes(job._id)
                          ? 'Unsave'
                          : 'Save'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}