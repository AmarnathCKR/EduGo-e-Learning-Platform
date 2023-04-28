import React, { useState, useEffect } from "react";

import { getAnyDataWithoutAuthStudentApi } from "../../../api/studentAPI";
import { useNavigate } from "react-router-dom";

const CourseDisplayCards = (props) => {
  const [courses, setCourses] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(props.search);
  const [sortOrder, setSortOrder] = useState("");
  const [fieldOfStudyFilter, setFieldOfStudyFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [fieldData, setFieldData] = useState([]);

  useEffect(() => {
    getAnyDataWithoutAuthStudentApi("fetch-fields")
      .then((res) => {
        setFieldData(res.data.data.content.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const url = `display-courses?page=${currentPage}&search=${searchQuery}&sort=${sortOrder}&fieldOfStudy=${fieldOfStudyFilter}&experience=${experienceFilter}`
        const response = await getAnyDataWithoutAuthStudentApi(url)
        setCourses(response.data.courses);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCourses();
  }, [
    currentPage,
    searchQuery,
    sortOrder,
    fieldOfStudyFilter,
    experienceFilter,
  ]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };
  const navigate = useNavigate()

  useEffect(() => {
    handleSearchChange(props.search);
  }, [props.search]);

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
    setCurrentPage(1);
  };

  const handleFieldOfStudyFilterChange = (event) => {
    setFieldOfStudyFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleExperienceFilterChange = (event) => {
    setExperienceFilter(event.target.value);
    setCurrentPage(1);
  };



  return (
    <>
      <div className="grid grid-cols-3 md:p-3 p-1">
        <div className="md:col-span-1 col-span-3 flex justify-center ">
          <label
            className="p-3 border rounded shadow w-52"
            htmlFor="sort-order"
          >
            Sort by:
          </label>
          <select
            className="p-3 border rounded shadow w-52 focus:outline-none"
            id="sort-order"
            value={sortOrder}
            onChange={handleSortOrderChange}
          >
            <option value="">None</option>
            <option value="name">Title</option>
            <option value="createdAt">Created Date</option>
            <option value="price">Price</option>
          </select>
        </div>
        <div className="md:col-span-1 col-span-3 flex justify-center ">
          <label
            className="p-3 border rounded shadow w-52"
            htmlFor="field-of-study-filter"
          >
            Field of Study:
          </label>
          <select
            className="p-3 border rounded shadow w-52 focus:outline-none"
            id="field-of-study-filter"
            value={fieldOfStudyFilter}
            onChange={handleFieldOfStudyFilterChange}
          >
            <option value="">All</option>
            {fieldData.map((items) => {
              return <option value={items._id}>{items.name}</option>;
            })}
          </select>
        </div>
        <div className="md:col-span-1 col-span-3 flex justify-center ">
          <label
            className="p-3 border rounded shadow w-52"
            htmlFor="experience-filter"
          >
            Experience:
          </label>
          <select
            className="p-3 border rounded shadow w-52 focus:outline-none"
            id="experience-filter"
            value={experienceFilter}
            onChange={handleExperienceFilterChange}
          >
            <option value="">All</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Professional">Professional</option>
            <option value="Expert">Expert</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1  md:grid-cols-2">
        {courses.map((data) => (
          <>
            <div onClick={() => { navigate(`/coursePage/:${data._id}`, { state: data._id }) }} >
              <div class="flex flex-col justify-center md:mx-5 mx-1 ">
                <div
                  class="relative flex flex-col md:flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-sm hover:shadow-lg p-3 max-w-xs md:max-w-3xl mx-auto border border-white bg-white">
                  <div class="w-full md:w-1/3 bg-white grid place-items-center">
                    <img src={data.image} alt="tailwind logo" class="rounded-xl" />
                  </div>
                  <div class="w-full md:w-2/3 bg-white flex flex-col space-y-2 p-3">
                    <div class="flex justify-between item-center">
                      
                      <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" viewBox="0 0 20 20"
                          fill="currentColor">
                          <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <p class="text-gray-600 font-bold text-sm ml-1">
                          4.96
                          <span class="text-gray-500 font-normal">(76 reviews)</span>
                        </p>
                      </div>
                      <div class="">
                       
                      </div>
                      <div class="bg-gray-200 px-3 py-1 rounded-full text-xs font-medium text-gray-800 hidden md:block">
                        {data.instructor.name}</div>
                    </div>
                    <h3 class="font-black text-gray-800 md:text-3xl text-xl">{data.name}</h3>
                    <p class="md:text-lg text-gray-500 text-base">{data.headline}</p>
                    <p class="text-xl font-black text-gray-800">
                    ₹{data.price}
                      <span class="font-normal text-gray-600 text-base"></span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ))}
      </div>

      <div className="flex justify-center">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            className="m-3 p-2 text-xl border bg-white shadow px-4"
            key={index}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
};

export default CourseDisplayCards;
