import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MetaData } from '../components/MetaData'
import { useSelector, useDispatch } from 'react-redux'
import { JobCard } from '../components/JobCard'
import { getAllJobs } from '../actions/JobActions'
import Testimonials from '../components/Testimonials/Testimonials.jsx'

export const Home = () => {
  const dispatch = useDispatch()
  const [num] = useState(2)

  // Defensive selector: handle state.jobs or state.job (depending on combineReducers)
  const jobState = useSelector((state) => state.jobs || state.job || {})
  const { loading = false, allJobs = [] } = jobState

  useEffect(() => {
    dispatch(getAllJobs())
  }, [dispatch])

  const convertDateFormat = (inputDate) => {
    if (!inputDate) return 'N/A'
    const parts = inputDate.split('-')
    if (parts.length !== 3) return inputDate
    const [year, month, day] = parts
    return `${day}-${month}-${year}`
  }

  // Pick featured jobs defensively (prefer latest ones)
  const featuredJobs = Array.isArray(allJobs) && allJobs.length > 0
    ? // pick up to 4 latest jobs (if available)
      allJobs
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4)
    : []

  const companyImages = [
    "/images/JobData/1.jpg","/images/JobData/2.jpg","/images/JobData/3.jpg","/images/JobData/4.jpg",
    "/images/JobData/5.jpg","/images/JobData/6.jpg","/images/JobData/7.jpg","/images/JobData/8.jpg",
    "/images/JobData/9.jpg","/images/JobData/10.jpg","/images/JobData/11.jpg","/images/JobData/12.jpg",
    "/images/JobData/13.jpg","/images/JobData/14.jpg","/images/JobData/15.jpg","/images/JobData/16.jpg",
    "/images/JobData/17.jpg","/images/JobData/18.jpg","/images/JobData/19.jpg","/images/JobData/20.jpg",
  ]

  return (
    <>
      <MetaData title="CampusHire" />
      <div className="min-h-screen md:px-20 px-3 pt-14 flex text-white bg-gray-950">
        <div className="w-full flex pt-28 flex-col justify-start items-center gap-4">

          {/* Hero */}
          <div className="flex md:flex-row flex-col items-center justify-center md:gap-10 gap-1">
            <div className="md:text-8xl text-6xl titleT">CAMPUS HIRE</div>
            <div className="flex justify-center items-center pt-1">
              <Link to="/jobs" className="font-semibold md:text-2xl text-lg blueCol md:py-3 py-2 px-6 md:px-10">
                Browse Gigs
              </Link>
            </div>
          </div>

          <p className="md:text-xl text-sm">Your <span className="text-yellow-500">gateway</span> to experience the real world.</p>

          {/* Featured Jobs */}
          <div className="pt-[6rem] md:px-[1rem] px-[0rem] w-full">
            <div className="titleT pb-6 text-2xl">
              <p className="titleT">Featured Jobs</p>
            </div>

            {loading ? (
              <div className="w-full flex justify-center items-center">
                <span className="loader1" />
              </div>
            ) : featuredJobs.length === 0 ? (
              <div className="text-center text-gray-400 py-6">
                No featured jobs yet — <Link to="/jobs" className="text-yellow-400 underline">browse all jobs</Link>
              </div>
            ) : (
              <div className="flex md:flex-row flex-col gap-3">
                {featuredJobs.map((job, idx) => (
                  <Link
                    key={job._id || idx}
                    to={`/details/${job._id}`}
                    className="flex gap-2 shadow-sm shadow-gray-800 border border-gray-700 md:w-[26rem] w-[21rem] p-2 flex-col hover:border-rose-500 transition duration-300 hover:scale-[1.02] hover:bg-slate-950"
                  >
                    <div className="flex gap-3">
                      <div className="w-[5rem] flex justify-center items-center">
                        <img src={job.companyLogo?.url || '/default-logo.png'} alt={job.title || 'logo'} className="w-[4rem] object-contain" />
                      </div>
                      <div>
                        <p className="text-xl">{job.title || 'Untitled'}</p>
                        <p className="text-lg">{job.companyName || 'Unknown Company'}</p>
                        <p className="text-sm">{(job.description || '').slice(0, 30) + (job.description ? '...' : '')}</p>
                      </div>
                    </div>

                    <div className="flex text-sm gap-8">
                      <span>{convertDateFormat((job.createdAt || '').slice(0, 10))}</span>
                      <span>{job.employmentType || 'N/A'}</span>
                      <span>{job.location || 'N/A'}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Companies grid */}
          <div className="pt-20 flex flex-col gap-4 md:px-[1rem] px-[1rem]">
            <div className="text-2xl titleT">Companies on our site</div>
            <div className="flex flex-wrap gap-3">
              {companyImages.map((src, i) => (
                <div key={i}>
                  <img src={src} className="w-[4rem]" alt={`company-${i}`} />
                </div>
              ))}
            </div>
          </div>

          <Testimonials />

          <div className="pt-[7rem] pb-[10rem] md:px-[14rem] px-[1rem] text-center">
            <p>Discover the Power of Possibility with CampusHire: Where Your Professional Journey Takes Flight, Guided by a Network of Diverse Opportunities!</p>
          </div>
        </div>
      </div>
    </>
  )
}
