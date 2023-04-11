import React from "react";


import { Route, Routes } from "react-router-dom";

import FieldManage from "./pages/FieldManage";

function AdminRouter() {
  return (
    <>
      <Routes>
        <Route>
          <Route path="/field" element={<FieldManage />} />
        </Route>
      </Routes>
    </>
  );
}

export default AdminRouter;
