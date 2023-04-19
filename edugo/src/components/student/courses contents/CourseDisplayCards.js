import React, { useState, useEffect } from "react";
import axios from "axios";

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
    axios
      .get("http://localhost:5000/fetch-fields")
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
        const response = await axios.get(
          `http://localhost:5000/display-courses?page=${currentPage}&search=${searchQuery}&sort=${sortOrder}&fieldOfStudy=${fieldOfStudyFilter}&experience=${experienceFilter}`
        );
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

  const style = {
    width: "240px",
    height: "150px",
  };

  return (
    <>
      <div className="grid grid-cols-3 p-5">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        {courses.map((data) => (
          <>
            <div class="local-wrapper mx-2 p-3 mb-3">
              <div className="p-2">
                <img
                  style={style}
                  src={data.image}
                  alt="courseLogo"
                  className="w-full object-cover object-center rounded-lg shadow-md"
                />

                <div class="relative  -mt-22 p-2">
                  <div class="bg-white p-3 w-60 h-52 rounded-lg shadow-lg ">
                    <h4 class="mt-1 text-xl font-semibold uppercase leading-tight truncate">
                      {data.name}
                    </h4>

                    <div class="mt-1">₹ {data.price}</div>
                    <div class="mt-4 ">
                      <span class="text-sm  text-gray-600">
                        {data.headline}
                      </span>
                    </div>
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
