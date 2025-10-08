import React, { useEffect, useState } from "react";
import { MetaData } from "../components/MetaData";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../components/Loader";
import { toast } from "react-toastify";
import { getAppData, updateApplication } from "../actions/AdminActions";

export const EditAppAdmin = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, applicationDetails: appData = {}, error } = useSelector(
    (state) => state.application || {}
  );

  const [status, setStatus] = useState("not");

  // Fetch specific application
  useEffect(() => {
    dispatch(getAppData(id));
  }, [dispatch, id]);

  // Error toast
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleStatusUpdate = () => {
    if (status === "not") {
      toast.error("Please select a valid status.");
      return;
    }
    dispatch(updateApplication(id, { status }))
      .then(() => {
        toast.success("Application status updated!");
        navigate("/admin/allApplications");
      })
      .catch(() => toast.error("Failed to update status."));
  };

  const toUpperFirst = (str = "") =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const formatDate = (iso) =>
    iso
      ? new Date(iso).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "--";

  const formatTime = (iso) =>
    iso
      ? new Date(iso).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      : "";

  if (loading) return <Loader />;

  return (
    <>
      <MetaData title={`Application #${id}`} />

      <div className="bg-gray-950 min-h-screen pt-20 md:px-20 px-4 text-white">
        <div className="max-w-4xl mx-auto space-y-10">
          <h1 className="text-3xl font-semibold text-center">
            Application #{id}
          </h1>

          {/* Job Info */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">Job Details</h2>
            <ul className="text-gray-300 space-y-1">
              <li>
                <span className="font-medium text-white">Title: </span>
                {appData.job?.title || "--"}
              </li>
              <li>
                <span className="font-medium text-white">Company: </span>
                {appData.job?.companyName || "--"}
              </li>
              <li>
                <span className="font-medium text-white">Location: </span>
                {appData.job?.location || "--"}
              </li>
              <li>
                <span className="font-medium text-white">Experience: </span>
                {appData.job?.experience || "--"}
              </li>
            </ul>
          </section>

          {/* Applicant Info */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">Applicant Details</h2>
            <ul className="text-gray-300 space-y-1">
              <li>
                <span className="font-medium text-white">Name: </span>
                {appData.applicant?.name || "--"}
              </li>
              <li>
                <span className="font-medium text-white">Email: </span>
                {appData.applicant?.email || "--"}
              </li>
              <li>
                <span className="font-medium text-white">College: </span>
                {appData.applicant?.college || "--"}
              </li>
              <li>
                <span className="font-medium text-white">Year: </span>
                {appData.applicant?.year
                  ? `Year ${appData.applicant.year}`
                  : "--"}
              </li>
              <li>
                <span className="font-medium text-white">Resume: </span>
                {appData.applicantResume?.url ? (
                  <Link
                    to={appData.applicantResume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                  >
                    View Resume
                  </Link>
                ) : (
                  "--"
                )}
              </li>
            </ul>
          </section>

          {/* Extra Applicant Info */}
          {(appData.portfolioLink || appData.workSamples?.length > 0) && (
            <section>
              <h2 className="text-2xl font-semibold mb-3">Extra Details</h2>
              <ul className="space-y-1 text-gray-300">
                {appData.portfolioLink && (
                  <li>
                    <span className="font-medium text-white">
                      Portfolio Link:
                    </span>{" "}
                    <a
                      href={appData.portfolioLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline"
                    >
                      {appData.portfolioLink}
                    </a>
                  </li>
                )}

                {appData.workSamples?.length > 0 && (
                  <li>
                    <span className="font-medium text-white">
                      Work Samples:
                    </span>{" "}
                    {appData.workSamples.map((ws) => (
                      <a
                        key={ws.public_id}
                        href={ws.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline mx-2"
                      >
                        Sample
                      </a>
                    ))}
                  </li>
                )}

                {appData.coverLetter && (
                  <li>
                    <span className="font-medium text-white">
                      Cover Letter:
                    </span>{" "}
                    {appData.coverLetter}
                  </li>
                )}

                <li>
                  <span className="font-medium text-white">
                    Expected Earnings:
                  </span>{" "}
                  ₹{appData.expectedEarnings || 0}
                </li>
              </ul>
            </section>
          )}

          {/* Status */}
          <section>
            <div className="flex items-center gap-3 text-xl">
              <span className="font-medium">Current Status:</span>
              <span
                className={`font-semibold ${
                  appData.status === "pending"
                    ? "text-blue-400"
                    : appData.status === "rejected"
                    ? "text-red-500"
                    : "text-green-400"
                }`}
              >
                {toUpperFirst(appData.status)}
              </span>
            </div>
          </section>

          {/* Update Status */}
          <section>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <select
                onChange={(e) => setStatus(e.target.value)}
                defaultValue="not"
                className="bg-gray-900 border border-gray-600 text-white py-2 px-4 rounded"
              >
                <option value="not">Select Status</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                onClick={handleStatusUpdate}
                className="blueCol py-2 px-6 rounded font-semibold"
              >
                Update Status
              </button>
            </div>
          </section>

          {/* Created Date */}
          <section className="text-gray-400">
            <p>
              <span className="font-medium text-white">
                Application Created:
              </span>{" "}
              {formatDate(appData.createdAt)} ({formatTime(appData.createdAt)})
            </p>
          </section>
        </div>
      </div>
    </>
  );
};