import { Link } from 'react-router-dom'
import useIsMobile from '../hooks/useIsMobile'

export const AppliedJobCard = ({ id, job, time, status }) => {
  const isMobile = useIsMobile()

  const convertDateFormat = (inputDate) => {
    const parts = inputDate.split('-')
    if (parts.length !== 3) return 'Invalid date format'
    const [year, month, day] = parts
    return `${day}-${month}-${year}`
  }

  return (
    <div className="text-white flex flex-col gap-2 shadow-sm shadow-gray-800 border border-gray-700 md:px-4 px-3 w-full py-3 rounded-md bg-gray-900 hover:bg-gray-800 transition-all">
      {/* --- Upper section --- */}
      <div className="flex gap-5 relative">
        {/* Logo */}
        <div className="flex justify-center items-center">
          {job?.companyLogo?.url && (
            <img
              src={job.companyLogo.url}
              className="md:w-[5em] h-16 w-16 md:h-20 object-contain bg-white rounded"
              alt={`${job?.companyName || 'Company'} logo`}
            />
          )}
        </div>

        {/* Job Info */}
        <div className="flex flex-col flex-1">
          <p className="md:text-xl text-lg font-semibold text-yellow-400">
            {job?.title || 'Untitled Job'}
          </p>
          <div className="flex justify-between gap-2">
            <div className="flex flex-col gap-1">
              <p className="text-sm">{job?.companyName}</p>
              <p className="text-sm">
                {job?.employmentType} • {job?.remoteType} • 
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
                  ? `${job.description.slice(0, 25)}…`
                  : 'No description'}
              </p>
              <p className="text-sm text-green-400 font-semibold">
                ₹{job?.payMin ?? 0} – ₹{job?.payMax ?? 0}
              </p>
            </div>

            {/* Button + status */}
            <div className="absolute md:right-3 right-0 md:pt-0 md:top-3 top-18 flex flex-col gap-3 items-end">
              <Link
                to={`/Application/Details/${id}`}
                className="blueCol font-semibold md:text-sm text-[0.6rem] px-3 py-1 text-center"
              >
                View Application
              </Link>
              <span
                className={`text-xs font-bold px-2 py-1 mt-1 rounded ${
                  status === 'accepted'
                    ? 'bg-green-700 text-white'
                    : status === 'rejected'
                    ? 'bg-red-700 text-white'
                    : 'bg-yellow-600 text-black'
                }`}
              >
                {status?.toUpperCase() || 'PENDING'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Bottom section --- */}
      <div className="flex md:gap-8 gap-3 md:text-sm text-xs pt-2 text-gray-300">
        <span>Applied on {convertDateFormat(time.substr(0, 10))}</span>
      </div>
    </div>
  )
}