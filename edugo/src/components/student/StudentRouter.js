import React from 'react'
import { Route, Routes } from 'react-router-dom'
import StudentLanding from './pages/StudentLanding'

function StudentRouter() {
  return (
    <Routes>
      
      <Route
        path="/"
        element={<StudentLanding />}
      />
    </Routes>
  )
}

export default StudentRouter