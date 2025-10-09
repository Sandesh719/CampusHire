import {
  newPostRequest,
  newPostSuccess,
  newPostFail,
  allJobsRequest,
  allJobsSuccess,
  allJobsFail,
  jobDetailsRequest,
  jobDetailsSuccess,
  jobDetailsFail,
  jobSaveRequest,
  jobSaveSuccess,
  jobSaveFail,
  getSavedJobsRequest,
  getSavedJobsSuccess,
  getSavedJobsFail,
} from "../slices/JobSlice";
import { toast } from "react-toastify";
import { me } from "../actions/UserActions";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/v1"; // ✅ single base URL for cleaner code

// ✅ Create a new job post
export const createJobPost = (jobData) => async (dispatch) => {
  try {
    dispatch(newPostRequest());

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    };

    const { data } = await axios.post(`${API_BASE_URL}/create/job`, jobData, config);

    dispatch(newPostSuccess());
    toast.success(data.message || "Job posted successfully!");
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to post job. Please try again.";
    dispatch(newPostFail(message));
    toast.error(message);
  }
};

// ✅ Fetch all jobs
export const getAllJobs = () => async (dispatch) => {
  try {
    dispatch(allJobsRequest());

    const { data } = await axios.get(`${API_BASE_URL}/jobs`);
    dispatch(allJobsSuccess(data.jobs || []));
  } catch (err) {
    const message =
      err.response?.data?.message || "Unable to fetch jobs. Try again later.";
    dispatch(allJobsFail(message));
    toast.error(message);
  }
};

// ✅ Fetch single job details
export const getSingleJob = (id) => async (dispatch) => {
  try {
    dispatch(jobDetailsRequest());

    const { data } = await axios.get(`${API_BASE_URL}/job/${id}`);
    dispatch(jobDetailsSuccess(data.job));
  } catch (err) {
    const message =
      err.response?.data?.message || "Unable to load job details.";
    dispatch(jobDetailsFail(message));
    toast.error(message);
  }
};

// ✅ Save a job
export const saveJob = (id) => async (dispatch) => {
  try {
    dispatch(jobSaveRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    };

    const { data } = await axios.get(`${API_BASE_URL}/saveJob/${id}`, config);

    // Refresh user data after saving
    dispatch(me());
    dispatch(jobSaveSuccess());
    toast.success(data.message || "Job saved successfully!");
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to save job. Please try again.";
    dispatch(jobSaveFail(message));
    toast.error(message);
  }
};

// ✅ Get all saved jobs
export const getSavedJobs = () => async (dispatch) => {
  try {
    dispatch(getSavedJobsRequest())

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
      },
    }

    const { data } = await axios.get(`${API_BASE_URL}/getSavedJobs`, config)

    // backend returns { success, count, savedJobs: [...] }
    const jobs = data.savedJobs || []
    dispatch(getSavedJobsSuccess(jobs))
  } catch (err) {
    const message =
      err.response?.data?.message || 'Unable to fetch saved jobs.'
    console.error('getSavedJobs error:', err)
    dispatch(getSavedJobsFail(message))
    toast.error(message)
  }
}

export const getMyJobs = () => async (dispatch) => {
  try {
    dispatch(allJobsRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    };

    const { data } = await axios.get(`${API_BASE_URL}/admin/myJobs`, config);
    // Backend returns: { success, count, jobs: [...] }
    const myJobs = data.jobs || [];
    dispatch(allJobsSuccess(myJobs));
  } catch (err) {
    const message =
      err.response?.data?.message ||
      "Unable to fetch your jobs. Please try again later.";
    dispatch(allJobsFail(message));
    toast.error(message);
  }
};