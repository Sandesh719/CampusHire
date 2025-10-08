import { createSlice } from "@reduxjs/toolkit";

const ApplicationSlice = createSlice({
  name: "Application",
  initialState: {
    loading: false,
    error: null,
    appliedJobs: [],
    allApplications: [],   // ✅ ← add this for recruiter use
    applicationDetails: {
      applicant: { _id: "", name: "", email: "" },
      applicantResume: { public_id: "", url: "" },
      job: { _id: "", title: "", companyName: "" },
      status: "",
      createdAt: "",
    },
  },
  reducers: {
    // ----- Creating new application -----
    createApplicationRequest: (state) => {
      state.loading = true;
    },
    createApplicationSuccess: (state) => {
      state.loading = false;
    },
    createApplicationFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ----- All jobs a student applied for -----
    allAppliedJobsRequest: (state) => {
      state.loading = true;
    },
    allAppliedJobsSuccess: (state, action) => {
      state.loading = false;
      state.appliedJobs = action.payload;
    },
    allAppliedJobsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ----- Single application details -----
    applicationDetailsRequest: (state) => {
      state.loading = true;
    },
    applicationDetailsSuccess: (state, action) => {
      state.loading = false;
      state.applicationDetails = action.payload;
    },
    applicationDetailsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ----- Delete application -----
    deleteApplicationRequest: (state) => {
      state.loading = true;
    },
    deleteApplicationSuccess: (state) => {
      state.loading = false;
    },
    deleteApplicationFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ✅ ----- Recruiter gets all applications -----
    allApplicationsRequest: (state) => {
      state.loading = true;
    },
    allApplicationsSuccess: (state, action) => {
      state.loading = false;
      state.allApplications = action.payload;
    },
    allApplicationsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  createApplicationRequest,
  createApplicationSuccess,
  createApplicationFail,
  allAppliedJobsRequest,
  allAppliedJobsSuccess,
  allAppliedJobsFail,
  applicationDetailsRequest,
  applicationDetailsSuccess,
  applicationDetailsFail,
  deleteApplicationRequest,
  deleteApplicationSuccess,
  deleteApplicationFail,
  allApplicationsRequest,      // ✅ new
  allApplicationsSuccess,      // ✅ new
  allApplicationsFail,         // ✅ new
} = ApplicationSlice.actions;

export default ApplicationSlice.reducer;