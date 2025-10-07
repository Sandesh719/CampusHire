import { useEffect, useState } from 'react'
import { MetaData } from '../components/MetaData'
import { FiSearch } from 'react-icons/fi'
import { Loader } from '../components/Loader'
import { JobCard } from '../components/JobCard'
import { useDispatch, useSelector } from 'react-redux'
import { getAllJobs, getSingleJob } from '../actions/JobActions'
import { Slider } from '@mantine/core'
import { RxCross2 } from 'react-icons/rx'
import useIsMobile from '../hooks/useIsMobile'

export const Jobs = () => {
  const dispatch = useDispatch()
  const { allJobs = [], loading = false } =
    useSelector(state => state.jobs || state.job || {})

  const [baseJobs, setBaseJobs] = useState([])
  const [jobs, setJobs] = useState([])

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [employmentType, setEmploymentType] = useState("")
  const [remoteType, setRemoteType] = useState("")
  const [payRange, setPayRange] = useState([0, 50000])
  const [durationRange, setDurationRange] = useState([0, 12])

  const [currentPage, setCurrentPage] = useState(1)
  const isMobile = useIsMobile()

  const categories = ['Design', 'Development', 'Content', 'Marketing', 'Data', 'Finance']
  const employmentTypes = ['micro-gig', 'freelance', 'internship', 'part-time']
  const remoteTypes = ['remote', 'on-site', 'hybrid']

  useEffect(() => {
    dispatch(getAllJobs())
  }, [dispatch])

  useEffect(() => {
    const list = Array.isArray(allJobs) ? allJobs : []
    setBaseJobs(list)
    setJobs(list)
    setCurrentPage(1)
  }, [allJobs])

  useEffect(() => {
    const q = search.trim().toLowerCase()
    if (!q) {
      setJobs(baseJobs)
      return
    }
    const filtered = baseJobs.filter(j => {
      const title = (j.title || '').toLowerCase()
      const company = (j.companyName || '').toLowerCase()
      const desc = (j.description || '').toLowerCase()
      const skills = Array.isArray(j.skillsRequired)
        ? j.skillsRequired.join(' ').toLowerCase()
        : ''
      return (
        title.includes(q) ||
        company.includes(q) ||
        desc.includes(q) ||
        skills.includes(q)
      )
    })
    setJobs(filtered)
    setCurrentPage(1)
  }, [search, baseJobs])

  const applyFilters = () => {
    const [minPay, maxPay] = payRange
    const [minDur, maxDur] = durationRange

    const filtered = baseJobs.filter(job => {
      const matchCategory = category ? job.category?.toLowerCase() === category.toLowerCase() : true
      const matchEmp = employmentType ? job.employmentType === employmentType : true
      const matchRemote = remoteType ? job.remoteType === remoteType : true
      const payOk = (job.payMax >= minPay || job.payMin >= minPay) && (job.payMin <= maxPay)
      const dur = job.durationWeeks || 0
      const durationOk = dur >= minDur && dur <= maxDur
      return matchCategory && matchEmp && matchRemote && payOk && durationOk
    })

    setJobs(filtered)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setCategory('')
    setEmploymentType('')
    setRemoteType('')
    setPayRange([0, 50000])
    setDurationRange([0, 12])
    setJobs(baseJobs)
  }

  const itemsPerPage = 5
  const totalPageCount = Math.ceil(jobs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const displayedData = jobs.slice(startIndex, startIndex + itemsPerPage)

  return (
    <>
      <MetaData title="Gigs" />
      <div className="bg-gray-950 min-h-screen pt-14 sm:px-20 px-3 text-white">
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="flex flex-col justify-center items-center w-full pb-8">
              <div className="text-center pt-8 sm:text-3xl text-2xl font-medium">
                <p>Find student gigs & micro‑internships</p>
              </div>

              {/* Search bar */}
              <div className="py-3 pt-4 w-full flex justify-center items-center">
                <div className="flex justify-center w-full items-center">
                  <div className="bg-white flex sm:w-2/5 w-4/5 rounded-lg overflow-hidden">
                    <div className="flex justify-center items-center pl-2 text-black">
                      <FiSearch size={19} />
                    </div>
                    <input
                      value={search}
                      placeholder="Search gigs"
                      onChange={(e) => setSearch(e.target.value)}
                      type="text"
                      className="outline-none text-black px-3 sm:h-10 h-8 py-1 text-sm flex-1"
                    />
                    <div className="text-black flex items-center px-2">
                      <RxCross2
                        onClick={() => setSearch('')}
                        size={19}
                        className={`cursor-pointer ${search ? 'flex' : 'hidden'}`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col pt-2 sm:flex-row w-full gap-20">
                {/* ---------- Left Filter Panel ---------- */}
                {!isMobile && (
                  <div className="bg-gray-900/60 p-4 rounded-lg shadow-lg sm:w-1/4 mb-8 sm:mb-0 text-gray-300">
                    {/* Category */}
                    <div className="mb-6">
                      <h3 className="text-sm uppercase tracking-wide text-gray-400 border-b border-gray-700 pb-1 mb-2">
                        Category
                      </h3>
                      <ul className="flex flex-col gap-1">
                        {categories.map(c => (
                          <li
                            key={c}
                            onClick={() => setCategory(c)}
                            className={`cursor-pointer transition-all px-2 py-1 rounded-md text-sm ${
                              category === c
                                ? 'bg-indigo-600 text-white font-semibold'
                                : 'hover:bg-gray-800 hover:text-yellow-400'
                            }`}
                          >
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Employment Type */}
                    <div className="mb-6">
                      <h3 className="text-sm uppercase tracking-wide text-gray-400 border-b border-gray-700 pb-1 mb-2">
                        Employment Type
                      </h3>
                      <ul className="flex flex-col gap-1">
                        {employmentTypes.map(t => (
                          <li
                            key={t}
                            onClick={() => setEmploymentType(t)}
                            className={`cursor-pointer transition-all px-2 py-1 rounded-md text-sm ${
                              employmentType === t
                                ? 'bg-indigo-600 text-white font-semibold'
                                : 'hover:bg-gray-800 hover:text-yellow-400'
                            }`}
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Remote Type */}
                    <div className="mb-6">
                      <h3 className="text-sm uppercase tracking-wide text-gray-400 border-b border-gray-700 pb-1 mb-2">
                        Remote Type
                      </h3>
                      <ul className="flex flex-col gap-1">
                        {remoteTypes.map(r => (
                          <li
                            key={r}
                            onClick={() => setRemoteType(r)}
                            className={`cursor-pointer transition-all px-2 py-1 rounded-md text-sm ${
                              remoteType === r
                                ? 'bg-indigo-600 text-white font-semibold'
                                : 'hover:bg-gray-800 hover:text-yellow-400'
                            }`}
                          >
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pay Range */}
                    <div className="mb-6">
                      <h3 className="text-sm uppercase tracking-wide text-gray-400 border-b border-gray-700 pb-1 mb-2">
                        Pay Range (₹)
                      </h3>
                      <Slider
                        color="indigo"
                        value={payRange}
                        onChange={setPayRange}
                        min={0}
                        max={50000}
                        step={500}
                        range="true"
                        className="w-48"
                      />
                      <div className="text-xs pt-1">
                        ₹{payRange[0]} — ₹{payRange[1]}
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="mb-4">
                      <h3 className="text-sm uppercase tracking-wide text-gray-400 border-b border-gray-700 pb-1 mb-2">
                        Duration (weeks)
                      </h3>
                      <Slider
                        color="indigo"
                        value={durationRange}
                        onChange={setDurationRange}
                        min={0}
                        max={52}
                        step={1}
                        range="true"
                        className="w-48"
                      />
                      <div className="text-xs pt-1">
                        {durationRange[0]} — {durationRange[1]} weeks
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-center gap-3 mt-4 text-sm">
                      <button
                        onClick={applyFilters}
                        className="px-3 py-1 bg-indigo-600 rounded hover:bg-indigo-700 transition-all"
                      >
                        Apply
                      </button>
                      <button
                        onClick={clearFilters}
                        className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-800 transition-all"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}

                {/* ---------- Job Listing ---------- */}
                <div className="sm:w-2/4 pb-20 pt-2">
                  <div className="flex flex-col sm:max-h-[30em] gap-4">
                    {displayedData && displayedData.length > 0 ? (
                      displayedData
                        .filter(j => j && j._id)
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map(job => (
                          <JobCard
                            key={job._id}
                            onClick={() => dispatch(getSingleJob(job._id))}
                            job={job}
                          />
                        ))
                    ) : (
                      <div className="flex justify-center items-center text-center pt-16 pb-12 sm:text-xl text-lg">
                        No gigs match your filters
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}