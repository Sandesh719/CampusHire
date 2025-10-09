import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { Loader } from "../components/Loader";
import { deleteJobData } from "../actions/AdminActions"; 
import { getMyJobs } from "../actions/JobActions";
import { MetaData } from "../components/MetaData";

export const MyPostedJobs = () => {
  const dispatch = useDispatch();
  const { loading, allJobs, error } = useSelector((state) => state.job);

  useEffect(() => {
    dispatch(getMyJobs());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      dispatch(deleteJobData(id));
      //toast.success("Job deleted successfully!");
    }
  };

  const convertDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) return <Loader />;
  if (error) toast.error(error);

  return (
    <>
      <MetaData title="My Posted Jobs | Recruiter Dashboard" />
      <div className="min-h-screen bg-gray-950 text-white pt-20 px-6 md:px-20">
        <h1 className="text-3xl font-semibold text-center mb-8">
          My Posted Jobs
        </h1>

        {allJobs && allJobs.length === 0 ? (
          <div className="text-center text-gray-400 mt-12">
            You haven’t posted any gigs yet.
            <br />
            <Link
              to="/admin/postJob"
              className="text-blue-400 hover:underline"
            >
              Post your first gig →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-xl">
            <table className="min-w-full text-sm text-gray-400">
              <thead className="bg-gray-900 text-gray-200 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Title</th>
                  <th className="px-6 py-3 text-left">Location</th>
                  <th className="px-6 py-3 text-left">Type</th>
                  <th className="px-6 py-3 text-left">Applicants</th>
                  <th className="px-6 py-3 text-left">Posted On</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {allJobs
                  .filter((job) => job._id)
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((job) => (
                    <tr
                      key={job._id}
                      className="border-b border-gray-800 hover:bg-gray-900 transition"
                    >
                      <td className="px-6 py-4 font-medium text-white">
                        {job.title}
                      </td>
                      <td className="px-6 py-4">{job.location || "—"}</td>
                      <td className="px-6 py-4 capitalize">
                        {job.employmentType}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {job.applicants?.length || 0}
                      </td>
                      <td className="px-6 py-4">{convertDate(job.createdAt)}</td>
                      <td className="px-6 py-4 text-center flex justify-center gap-4">
                        <Link
                          to={`/admin/job/update/${job._id}`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <MdOutlineModeEditOutline size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(job._id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <AiOutlineDelete size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};
