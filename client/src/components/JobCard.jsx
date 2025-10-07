import { Link } from 'react-router-dom'
import useIsMobile from '../hooks/useIsMobile'

export const JobCard = ({ job }) => {
  const isMobile = useIsMobile()

  const convertDateFormat = (inputDate) => {
    if (!inputDate) return 'N/A'
    const parts = inputDate.split('-')
    if (parts.length !== 3) return 'Invalid date'
    const [year, month, day] = parts
    return `${day}-${month}-${year}`
  }

  return (
    <Link
      to={`/details/${job?._id}`}
      className="text-white flex flex-col gap-2 shadow-sm shadow-gray-800 border border-gray-700 md:px-4 px-3 w-full py-2 hover:border-blue-500 transition-colors"
    >
      <div className="flex gap-5 relative">
        <div className="flex justify-center items-center">
          <img
            src={job?.companyLogo?.url || '/default-logo.png'}
            alt="Company logo"
            className="w-[4rem] h-[4rem] object-contain rounded-md"
          />
        </div>

        <div className="flex flex-col flex-1">
          <p className="md:text-xl text-lg font-semibold">{job?.title || 'Untitled Job'}</p>

          <div className="flex justify-between gap-2">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-300">{job?.companyName || 'Unknown Company'}</p>
              <p className="text-sm text-gray-400">{job?.exp || 'Experience not specified'}</p>

              {/* Description snippet (responsive) */}
              {!isMobile ? (
                <p className="text-sm text-gray-400">
                  {job?.description ? `${job?.description.slice(0, 64)}...` : 'No description available'}
                </p>
              ) : (
                <p className="text-sm text-gray-400">
                  {job?.description ? `${job?.description.slice(0, 39)}...` : 'No description'}
                </p>
              )}
            </div>

            <div className="absolute md:right-3 right-0 top-3">
              <button className="blueCol font-semibold md:text-sm text-xs px-3 py-1 rounded">
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex md:gap-8 gap-3 md:text-sm text-xs text-gray-400">
        <span>{convertDateFormat(job?.createdAt?.substr(0, 10))}</span>
        <span>{job?.employmentType || 'Type N/A'}</span>
        <span>{job?.location || 'Location not specified'}</span>
      </div>
    </Link>
  )
}
