import { configureStore,createSlice } from "@reduxjs/toolkit";

const tokenSlice = createSlice({
    name : "JWT AUTH",
    initialState : "",
    reducers : {
        
        subscribeToken : (state, actions) => {
            return state = actions.payload
        },
        unsuscribeToken : (state, actions) => {
            return state = ''
        },
    }
})

const InstructorProfileSlice = createSlice({
    name : "InstructorProfile",
    initialState : "",
    reducers : {
        
        subscribeTeacher : (state, actions) => {
            return state = actions.payload
        },
        unsuscribeTeacher : (state, actions) => {
            return state = ''
        },
    }
})

const courseSlice = createSlice({
    name : "course",
    initialState : "",
    reducers : {
        
        subscribeCourse : (state, actions) => {
            return state = actions.payload
        },
        unsuscribeCourse : (state, actions) => {
            return state = ''
        },
    }
})

const adminSlice = createSlice({
    name : "admin-token",
    initialState : "",
    reducers : {
        
        subscribeAdminToken : (state, actions) => {
            return state = actions.payload
        },
        unsuscribeAdminToken : (state, actions) => {
            return state = ''
        },
    }
})

const allDataSlice = createSlice({
    name : "allData",
    initialState : "",
    reducers : {
        
        subscribeAllData : (state, actions) => {
            return state = actions.payload
        },
        unsuscribeAllData : (state, actions) => {
            return state = ''
        },
    }
})



const store = configureStore({
    reducer : {
        token : tokenSlice.reducer,
        InstructorProfile : InstructorProfileSlice.reducer,
        course : courseSlice.reducer,
        adminToken : adminSlice.reducer,
        allData : allDataSlice.reducer,
    }

})



export default store

export const {subscribeToken, unsuscribeToken} = tokenSlice.actions
export const {subscribeTeacher, unsuscribeTeacher} = InstructorProfileSlice.actions
export const {subscribeCourse, unsuscribeCourse} = courseSlice.actions
export const {subscribeAdminToken, unsuscribeAdminToken} =adminSlice.actions
export const {subscribeAllData, unsuscribeAllData} = allDataSlice.actions

