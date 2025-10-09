import React, { useState, useEffect } from "react";
import { MetaData } from "../components/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { getJobData,updateJobData } from "../actions/AdminActions";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { TbLoader2 } from "react-icons/tb";
import { Loader } from "../components/Loader";

export const EditJobAdmin = () => {
  const { id } = useParams();
  const { me } = useSelector((state) => state.user || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { jobDetails, loading } = useSelector((state) => state.job);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    skillsRequired: "",
    experience: "",
    payType: "fixed",
    payMin: "",
    payMax: "",
    category: "",
    employmentType: "micro-gig",
    durationWeeks: "",
    hoursPerWeek: "",
    remoteType: "remote",
    eligibilityMinYear: "",
    eligibilityMaxYear: "",
    maxApplicants: "",
    deadline: "",
  });

  // Fetch the job details first
  useEffect(() => {
    dispatch(getJobData(id));
  }, [dispatch, id]);

  // Populate form once the job data is in Redux
  useEffect(() => {
    if (jobDetails && jobDetails._id === id) {
      setForm({
        title: jobDetails.title || "",
        description: jobDetails.description || "",
        location: jobDetails.location || "",
        skillsRequired: jobDetails.skillsRequired?.join(", ") || "",
        experience: jobDetails.experience || "",
        payType: jobDetails.payType || "fixed",
        payMin: jobDetails.payMin || "",
        payMax: jobDetails.payMax || "",
        category: jobDetails.category || "",
        employmentType: jobDetails.employmentType || "micro-gig",
        durationWeeks: jobDetails.durationWeeks || "",
        hoursPerWeek: jobDetails.hoursPerWeek || "",
        remoteType: jobDetails.remoteType || "remote",
        eligibilityMinYear: jobDetails.eligibility?.minYear || "",
        eligibilityMaxYear: jobDetails.eligibility?.maxYear || "",
        maxApplicants: jobDetails.maxApplicants || "",
        deadline: jobDetails.deadline
          ? jobDetails.deadline.split("T")[0]
          : "",
      });
    }
  }, [jobDetails, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description } = form;
    if (!title || !description) {
      toast.error("Please fill title and description");
      return;
    }

    const payload = {
      ...form,
      companyName: me?.companyName,
      skillsRequired: form.skillsRequired
        ? form.skillsRequired.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      payMin: form.payMin ? Number(form.payMin) : 0,
      payMax: form.payMax ? Number(form.payMax) : 0,
      durationWeeks: form.durationWeeks ? Number(form.durationWeeks) : 0,
      hoursPerWeek: form.hoursPerWeek ? Number(form.hoursPerWeek) : 0,
      eligibility: {
        minYear: form.eligibilityMinYear
          ? Number(form.eligibilityMinYear)
          : undefined,
        maxYear: form.eligibilityMaxYear
          ? Number(form.eligibilityMaxYear)
          : undefined,
      },
      maxApplicants: form.maxApplicants
        ? Number(form.maxApplicants)
        : undefined,
    };

    await dispatch(updateJobData(id, payload));
    toast.success("Job updated successfully!");
    navigate("/admin/myJobs");
  };

  if (loading) return <Loader />;

  return (
    <>
      <MetaData title={`Edit Job | ${form.title}`} />
      <div className="bg-gray-950 min-h-screen pt-14 md:px-20 px-4 text-white">
        <div className="max-w-5xl mx-auto pb-12">
          <h1 className="text-3xl font-semibold mb-6">Edit Job</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Job Title */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Job Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g. Frontend Developer"
                className="w-full px-3 py-2 text-black rounded outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-3 py-2 text-black rounded outline-none resize-y"
              />
            </div>

            {/* Row 1 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Location</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-black rounded outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Category</label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-black rounded outline-none"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Experience</label>
                <input
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-black rounded outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Employment Type
                </label>
                <select
                  name="employmentType"
                  value={form.employmentType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-black rounded outline-none"
                >
                  <option value="micro-gig">Micro-gig</option>
                  <option value="freelance">Freelance</option>
                  <option value="internship">Internship</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="full-time">Full-time</option>
                </select>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Pay Type</label>
                <select
                  name="payType"
                  value={form.payType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-black rounded outline-none"
                >
                  <option value="fixed">Fixed</option>
                  <option value="hourly">Hourly</option>
                  <option value="stipend">Stipend</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Pay Min</label>
                <input
                  name="payMin"
                  value={form.payMin}
                  onChange={handleChange}
                  type="number"
                  className="w-full px-3 py-2 text-black rounded outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Pay Max</label>
                <input
                  name="payMax"
                  value={form.payMax}
                  onChange={handleChange}
                  type="number"
                  className="w-full px-3 py-2 text-black rounded outline-none"
                />
              </div>
            </div>

            {/* Remote Type & Duration */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Remote Type</label>
                <select
                  name="remoteType"
                  value={form.remoteType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-black rounded outline-none"
                >
                  <option value="remote">Remote</option>
                  <option value="on-site">On-site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Duration (weeks)
                </label>
                <input
                  name="durationWeeks"
                  value={form.durationWeeks}
                  onChange={handleChange}
                  type="number"
                  className="w-full px-3 py-2 text-black rounded outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Hours / Week</label>
                <input
                  name="hoursPerWeek"
                  value={form.hoursPerWeek}
                  onChange={handleChange}
                  type="number"
                  className="w-full px-3 py-2 text-black rounded outline-none"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Skills Required (comma separated)
              </label>
              <input
                name="skillsRequired"
                value={form.skillsRequired}
                onChange={handleChange}
                className="w-full px-3 py-2 text-black rounded outline-none"
              />
            </div>

            {/* Eligibility */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Eligibility Min Year
                </label>
                <input
                  name="eligibilityMinYear"
                  value={form.eligibilityMinYear}
                  onChange={handleChange}
                  type="number"
                  className="w-full px-3 py-2 text-black rounded outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Eligibility Max Year
                </label>
                <input
                  name="eligibilityMaxYear"
                  value={form.eligibilityMaxYear}
                  onChange={handleChange}
                  type="number"
                  className="w-full px-3 py-2 text-black rounded outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Max Applicants</label>
                <input
                  name="maxApplicants"
                  value={form.maxApplicants}
                  onChange={handleChange}
                  type="number"
                  className="w-full px-3 py-2 text-black rounded outline-none"
                />
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Deadline</label>
              <input
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                type="date"
                className="w-full px-3 py-2 text-black rounded outline-none"
              />
            </div>

            {/* Submit */}
            <div className="pt-6 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="blueCol px-6 py-2 rounded font-semibold inline-flex items-center gap-2"
              >
                {loading ? <TbLoader2 className="animate-spin" size={18} /> : "Update Job"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/myJobs")}
                className="px-5 py-2 border border-gray-600 rounded text-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};