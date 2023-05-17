import React from "react";
import { useNavigate } from "react-router-dom";

function CourseList(props) {
  const navigate = useNavigate()
  const imageContainer = {
    height: "200px",
    width: "300px",
  };


  return (
    <>{props?.course?.map((data) => {
      return (
        <div className="w-full" key={data._id} onClick={() => { navigate(`/instructor/coursePage/:${data._id}`, { state: data._id }) }}>

          
              <div class="-mx-4 flex w-full flex-wrap">
                <div class="w-full px-4">
                  <div class="mb-10 overflow-hidden rounded-lg bg-white">
                    <img
                      src={data.image}
                      alt="blah"
                      class="w-full"
                    />
                    <div class="p-8 text-center sm:p-9 md:p-7 xl:p-9">
                      <h3>
                        <p

                          class="text-dark hover:text-primary mb-4 block text-xl font-semibold sm:text-[22px] md:text-xl lg:text-[22px] xl:text-xl 2xl:text-[22px]"
                        >
                          {data.name}
                        </p>
                      </h3>
                      <p class="text-body-color mb-7 text-base leading-relaxed">
                        {data.headline}
                      </p>
                      <p
                        onClick={() => { navigate(`/instructor/coursePage/:${data._id}`, { state: data._id }) }}
                        class="text-body-color hover:border-primary hover:bg-primary inline-block rounded-full border border-[#E5E7EB] py-2 px-7 text-base font-medium transition hover:text-white"
                      >
                        View Details
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            

        </div>
      );
    })}

    </>
  );
}

export default CourseList;
