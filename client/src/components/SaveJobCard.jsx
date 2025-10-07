import { Link } from 'react-router-dom'
import { saveJob } from '../actions/JobActions'
import { useDispatch } from 'react-redux'
import useIsMobile from '../hooks/useIsMobile'

export const SaveJobCard = ({ job }) => {
  const dispatch = useDispatch()
  const isMobile = useIsMobile()

  const convertDateFormat = (isoString) => {
    if (!isoString) return 'Unknown date'
    try {
      const date = new Date(isoString)
      return date.toLocaleDateString()
    } catch {
      return 'Invalid date'
    }
  }

  const unSaveJobHandler = () => {
    dispatch(saveJob(job?._id))
  }

  return (
    <div className="text-white flex flex-col gap-2 shadow-sm shadow-gray-800 border border-gray-700 md:px-4 px-3 w-full py-3 rounded-md bg-gray-900 hover:bg-gray-800 transition-all">

      {/* --- Top Section --- */}
      <div className="flex gap-5 relative">
        <div className="flex justify-center items-center">
          <img
            src={job?.companyLogo?.url || '/images/company-placeholder.png'}
            alt={job?.companyName || 'Company'}
            className="md:w-[5em] h-16 w-16 md:h-20 object-contain bg-white rounded"
          />
        </div>

        <div className="flex flex-col flex-1">
          <p className="md:text-xl text-lg font-semibold text-yellow-400">
            {job?.title || 'Untitled Job'}
          </p>

          <div className="flex justify-between gap-2">
            {/* --- Job info --- */}
            <div className="flex flex-col gap-1">
              <p className="text-sm">{job?.companyName || 'Unknown Company'}</p>
              <p className="text-sm text-gray-300">
                {job?.employmentType} • {job?.remoteType} •
                {job?.location || 'Remote'}
              </p>

              {!isMobile && (
                <p className="text-sm text-gray-400">
                  {job?.description
                    ? `${job.description.slice(0, 90)}…`
                    : 'No description provided'}
                </p>
              )}

              <p className="text-sm flex md:hidden text-gray-400">
                {job?.description
                  ? `${job?.description?.slice(0, 25)}…`
                  : 'No description'}
              </p>
            </div>

            {/* --- Action Buttons --- */}
            <div className="absolute md:right-3 right-0 md:pt-0 top-7 text-sm flex flex-col gap-4 items-end">
              <Link
                to={`/details/${job?._id}`}
                className="blueCol font-semibold md:text-sm text-xs px-3 py-1 text-center rounded"
              >
                Apply
              </Link>
              <button
                onClick={unSaveJobHandler}
                className="blueCol font-semibold md:text-sm text-xs px-3 py-1 text-center rounded"
              >
                Unsave
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Bottom Row --- */}
      <div className="flex flex-wrap md:gap-8 gap-3 md:text-sm text-xs text-gray-300 pt-2">
        <span>Saved on {convertDateFormat(job?.createdAt)}</span>
        <span>Category: {job?.category || 'General'}</span>
        <span>
          Pay: ₹{job?.payMin ?? 0}-₹{job?.payMax ?? 0}
        </span>
      </div>
    </div>
  )
}