import React from "react";

function CourseViewModal(props) {
  return (
    <>
      {props.show && (
        <>
          <div className="z-30 modal-local p-4">
            <div className="modal-local-content rounded">
              <div className="modal-local-header">
                <h4 className="modal-local-title text-center font-bold text-xl">
                  {props.data
                    ? "Edit Field Category"
                    : "Add new Field Category"}
                </h4>
              </div>
              <div className="modal-local-body text-center">
                <h1>{props.data.name}</h1>
                <h1>{props.data.image}</h1>
                <h1>{props.data.video}</h1>
                <h1>{props.data.instructor.name}</h1>
                <h1>{props.data.status}</h1>
                <h1>{props.data._id}</h1>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default CourseViewModal;
