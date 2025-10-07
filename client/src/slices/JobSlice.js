import { createSlice } from "@reduxjs/toolkit";

const JobSlice = createSlice({
  name: "Job",
  initialState: {
    loading: false,
    saveJobLoading: false,
    error: null,
    jobDetails: {
      _id: "",
      title: "",
      description: "",
      companyName: "",
      companyWebsite: "",
      companyLogo: { public_id: "", url: "" },
      location: "",
      salary: "",
      category: "",
      experience: "",
      employmentType: "",
      jobType: "",
      skillsRequired: [],
      deadline: "",
      status: "",
      postedBy: "",
      applicants: [],
      createdAt: "",
      updatedAt: "",
      __v: 0,
    },
    allJobs: [],
    savedJobs: [],
  },
  reducers: {
    newPostRequest: (state) => { state.loading = true; },
    newPostSuccess: (state) => { state.loading = false; },
    newPostFail: (state, action) => { state.loading = false; state.error = action.payload; },

    allJobsRequest: (state) => { state.loading = true; },
    allJobsSuccess: (state, action) => { state.loading = false; state.allJobs = action.payload; },
    allJobsFail: (state, action) => { state.loading = false; state.error = action.payload; },

    jobDetailsRequest: (state) => { state.loading = true; },
    jobDetailsSuccess: (state, action) => { state.loading = false; state.jobDetails = action.payload; },
    jobDetailsFail: (state, action) => { state.loading = false; state.error = action.payload; },

    jobSaveRequest: (state) => { state.saveJobLoading = true; },
    jobSaveSuccess: (state) => { state.saveJobLoading = false; },
    jobSaveFail: (state, action) => { state.saveJobLoading = false; state.error = action.payload; },

    getSavedJobsRequest: (state) => { state.loading = true; },
    getSavedJobsSuccess: (state, action) => {
      state.loading = false;
      if (Array.isArray(action.payload)) {
        state.savedJobs = action.payload;
      } else if (action.payload && Array.isArray(action.payload.savedJobs)) {
        state.savedJobs = action.payload.savedJobs;
      } else {
        state.savedJobs = [];
      }
    },
    getSavedJobsFail: (state, action) => { state.loading = false; state.error = action.payload; },

    clearErrors: (state) => { state.error = null; },
  },
});

export const {
  newPostRequest, newPostSuccess, newPostFail,
  allJobsRequest, allJobsSuccess, allJobsFail,
  jobDetailsRequest, jobDetailsSuccess, jobDetailsFail,
  jobSaveRequest, jobSaveSuccess, jobSaveFail,
  getSavedJobsRequest, getSavedJobsSuccess, getSavedJobsFail,
  clearErrors,
} = JobSlice.actions;

export default JobSlice.reducer;
