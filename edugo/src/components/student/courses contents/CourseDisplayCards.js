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

  return (
    <>
      <div className="grid grid-cols-3 p-5">
        <div className="md:col-span-1 col-span-3 flex justify-center w-48">
          <label className="p-3 border rounded shadow" htmlFor="sort-order">Sort by:</label>
          <select
          className="p-3 border rounded shadow"
            id="sort-order"
            value={sortOrder}
            onChange={handleSortOrderChange}
          >
            <option value="">None</option>
            <option value="title">Title</option>
            <option value="startDate">Start Date</option>
            <option value="endDate">End Date</option>
            <option value="price">Price</option>
          </select>
        </div>
        <div className="md:col-span-1 col-span-3 flex justify-center w-48">
          <label className="p-3 border rounded shadow" htmlFor="field-of-study-filter">Field of Study:</label>
          <select
          className="p-3 border rounded shadow"
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
        <div className="md:col-span-1 col-span-3 flex justify-center w-48">
          <label className="p-3 border rounded shadow" htmlFor="experience-filter">Experience:</label>
          <select
            className="p-3 border rounded shadow"
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
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Field of Study</th>
            <th>Experience</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.name}</td>
              <td>{course.fieldOfStudy}</td>
              <td>{course.experience}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {Array.from({ length: totalPages }).map((_, index) => (
          <button key={index} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
};

export default CourseDisplayCards;
