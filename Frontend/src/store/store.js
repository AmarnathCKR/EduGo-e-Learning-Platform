import { configureStore, createSlice } from "@reduxjs/toolkit";

const tokenSlice = createSlice({
  name: "JWT AUTH",
  initialState: "",
  reducers: {
    subscribeToken: (state, actions) => {
      return (state = actions.payload);
    },
    unsuscribeToken: (state, actions) => {
      return (state = "");
    },
  },
});

const adminTokenSlice = createSlice({
  name: "JWT AUTH",
  initialState: "",
  reducers: {
    subscribeAdminToken: (state, actions) => {
      return (state = actions.payload);
    },
    unsuscribeAdminToken: (state, actions) => {
      return (state = "");
    },
  },
});

const InstructorProfileSlice = createSlice({
  name: "InstructorProfile",
  initialState: "",
  reducers: {
    subscribeTeacher: (state, actions) => {
      return (state = actions.payload);
    },
    unsuscribeTeacher: (state, actions) => {
      return (state = "");
    },
  },
});

const courseSlice = createSlice({
  name: "course",
  initialState: "",
  reducers: {
    subscribeCourse: (state, actions) => {
      return (state = actions.payload);
    },
    unsuscribeCourse: (state, actions) => {
      return (state = "");
    },
  },
});

const AllCourseSlice = createSlice({
  name: "AllCourse",
  initialState: [],
  reducers: {
    subscribeAllCourse: (state, actions) => {
      return (state = actions.payload);
    },
    unsuscribeAllCourse: (state, actions) => {
      return (state = "");
    },
  },
});

const studentTokenSlice = createSlice({
  name: "allData",
  initialState: "",
  reducers: {
    subscribeStudentToken: (state, actions) => {
      return (state = actions.payload);
    },
    unsuscribeStudentToken: (state, actions) => {
      return (state = "");
    },
  },
});

const studentDataSlice = createSlice({
  name: "allData",
  initialState: "",
  reducers: {
    subscribeStudentData: (state, actions) => {
      return (state = actions.payload);
    },
    unsuscribeStudentData: (state, actions) => {
      return (state = "");
    },
  },
});

const studentSearchSlice = createSlice({
  name: "studentSearch",
  initialState: "",
  reducers: {
    subscribeStudentSearch: (state, actions) => {
      return (state = actions.payload);
    },
    unsuscribeStudentSearch: (state, actions) => {
      return (state = "");
    },
  },
});

const instructorSearchSlice = createSlice({
  name: "instructorSearch",
  initialState: "",
  reducers: {
    subscribeInstructorSearch: (state, actions) => {
      return (state = actions.payload);
    },
    unsuscribeInstructorSearch: (state, actions) => {
      return (state = "");
    },
  },
});

const store = configureStore({
  reducer: {
    token: tokenSlice.reducer,
    InstructorProfile: InstructorProfileSlice.reducer,
    course: courseSlice.reducer,
    AllCourse: AllCourseSlice.reducer,
    studentToken: studentTokenSlice.reducer,
    studentData: studentDataSlice.reducer,
    adminToken: adminTokenSlice.reducer,
    studentSearch: studentSearchSlice.reducer,
    instructorSearch: instructorSearchSlice.reducer,
  },
});

export default store;

export const { subscribeToken, unsuscribeToken } = tokenSlice.actions;
export const { subscribeTeacher, unsuscribeTeacher } =
  InstructorProfileSlice.actions;
export const { subscribeCourse, unsuscribeCourse } = courseSlice.actions;
export const { subscribeAllCourse, unsuscribeAllCourse } =
  AllCourseSlice.actions;
export const { subscribeStudentToken, unsuscribeStudentToken } =
  studentTokenSlice.actions;
export const { subscribeStudentData, unsuscribeStudentData } =
  studentDataSlice.actions;
export const { subscribeStudentSearch, unsuscribeStudentSearch } =
  studentSearchSlice.actions;
export const { subscribeInstructorSearch, unsuscribeInstructorSearch } =
  instructorSearchSlice.actions;

export const { subscribeAdminToken, unsuscribeAdminToken } =
  adminTokenSlice.actions;
