import { useEffect, useState } from "react";
import { MetaData } from "../components/MetaData";
import { Sidebar } from "../components/Sidebar";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { Loader } from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { getAllAppAdmin, deleteApp } from "../actions/AdminActions";

export const ViewAllAppli = () => {
  const dispatch = useDispatch();
  const { loading, allApplications, error } = useSelector(
    (state) => state.application || {}
  );
  const [sideTog, setSideTog] = useState(false);

  // Fetch recruiter applications
  useEffect(() => {
    dispatch(getAllAppAdmin());
  }, [dispatch]);

  // Show any API errors
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const convertDateFormat = (dateStr) => {
    if (!dateStr) return "--";
    try {
      const [year, month, day] = dateStr.split("-"); // 2025-05-20
      return `${day}-${month}-${year}`;
    } catch {
      return dateStr;
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      dispatch(deleteApp(id));
    }
  };

  return (
    <>
      <MetaData title="All Applications | Recruiter Dashboard" />
      <div className="bg-gray-950 min-h-screen pt-14 md:px-20 px-3 text-white">
        {loading ? (
          <Loader />
        ) : (
          <div>
            {/* Sidebar toggler */}

            {/* Header */}
            <div>
              <p className="text-center pt-3 pb-4 text-3xl font-medium">
                All Applications
              </p>
            </div>

            {/* Applications Table */}
            <div className="relative pb-24 overflow-x-auto shadow-md">
              {allApplications && allApplications.length > 0 ? (
                <table className="w-full text-sm text-left text-gray-400">
                  <thead className="text-xs text-gray-200 uppercase blueCol">
                    <tr>
                      <th className="px-6 py-3">Application ID</th>
                      <th className="px-6 py-3">Job Title</th>
                      <th className="px-6 py-3">Applicant</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Applied On</th>
                      <th className="px-6 py-3 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {allApplications
                      .filter((app) => app._id)
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt) - new Date(a.createdAt)
                      )
                      .map((app) => (
                        <tr
                          key={app._id}
                          className="border-b border-gray-800 hover:bg-gray-900 transition"
                        >
                          <td className="px-6 py-4 font-medium text-white">
                            {app._id}
                          </td>
                          <td className="px-6 py-4">
                            {app.job?.title || "--"}
                          </td>
                          <td className="px-6 py-4">
                            {app.applicant?.name || "--"}
                          </td>
                          <td
                            className={`px-6 py-4 font-semibold ${
                              app.status === "pending"
                                ? "text-blue-400"
                                : app.status === "rejected"
                                ? "text-red-500"
                                : "text-green-400"
                            }`}
                          >
                            {app.status}
                          </td>
                          <td className="px-6 py-4">
                            {convertDateFormat(app.createdAt?.substring(0, 10))}
                          </td>
                          <td className="px-6 py-4 flex gap-4 justify-center">
                            <Link
                              to={`/admin/update/application/${app._id}`}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <MdOutlineModeEditOutline size={20} />
                            </Link>
                            <button
                              onClick={() => handleDelete(app._id)}
                              className="text-red-500 hover:text-red-400"
                            >
                              <AiOutlineDelete size={20} />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-16 text-gray-400">
                  No applications found for your job posts.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};