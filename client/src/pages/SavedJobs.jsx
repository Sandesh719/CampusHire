import React, { useEffect } from 'react'
import { MetaData } from '../components/MetaData'
import { getSavedJobs } from '../actions/JobActions'
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from '../components/Loader'
import { SaveJobCard } from '../components/SaveJobCard'
import { Link } from 'react-router-dom'

export const SavedJobs = () => {
  const dispatch = useDispatch()

  const jobState = useSelector(state => state.jobs || state.job || {})
  const { savedJobs = [], saveJobLoading = false, loading = false } = jobState

  // Fetch saved jobs on mount and whenever save/unsave finishes
  useEffect(() => {
    dispatch(getSavedJobs())
  }, [dispatch, saveJobLoading])

  return (
    <>
      <MetaData title="Saved Jobs" />

      <div className="bg-gray-950 min-h-screen pt-14 md:px-20 px-3 text-white">
        {loading ? (
          <Loader />
        ) : (
          <div className="pt-6 md:px-28 px-1 pb-32">
            {savedJobs.length > 0 && (
              <div className="text-center text-3xl pb-4 font-medium">
                Saved Jobs
              </div>
            )}

            {/* List */}
            <div className="flex flex-col gap-4">
              {savedJobs
                .slice()
                .reverse()
                .map((job) =>
                  job ? <SaveJobCard key={job._id || job.id} job={job} /> : null
                )}
            </div>

            {/* Empty state */}
            {savedJobs.length === 0 && (
              <div className="pt-10 text-center flex flex-col justify-center items-center">
                <div>
                  <img
                    src="/images/jobEmpty.svg"
                    className="w-52 h-52"
                    alt="No saved jobs"
                  />
                </div>
                <p className="md:text-3xl pb-3 pt-4 text-xl">
                  You don’t have any saved gigs!
                </p>
                <Link to="/jobs" className="blueCol px-5 py-1">
                  Browse Gigs
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}