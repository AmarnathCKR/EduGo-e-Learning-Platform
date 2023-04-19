import React, { useEffect, useState } from "react";
import {
  subscribeStudentSearch,
  unsuscribeStudentData,
  unsuscribeStudentToken,
} from "../../../store/store";
import { googleLogout } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import logo from "../../../Assets/logo.png";
import axios from "axios";
import { debounce } from "lodash";

function HeaderLanding(props) {
  const [menuToggler, setToggle] = useState(false);
  const [menuResponsive, setMenu] = useState(false);

  const [searchSuggestions, setSearchSuggestions] = useState([]);

  const [searchKeyword, setSearchKeyword] = useState(props.search);

  const [isOpen, setIsOpen] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleToggle = () => {
    setMenu(!menuResponsive);
  };
  const handleLogout = () => {
    localStorage.removeItem("StudentToken");
    dispatch(unsuscribeStudentToken());
    localStorage.removeItem("StudentData");
    dispatch(unsuscribeStudentData());
    navigate("/");
    googleLogout();
    toggleDropdown();
  };
  const handleLogout2 = () => {
    localStorage.removeItem("StudentToken");
    dispatch(unsuscribeStudentToken());
    localStorage.removeItem("StudentData");
    dispatch(unsuscribeStudentData());
    navigate("/");
    googleLogout();
    toggleDropdown();
  };

  useEffect(() => {
    window.innerWidth > 900 && setToggle(true);
    window.addEventListener("resize", () => {
      window.innerWidth < 900 ? setToggle(false) : setToggle(true);
      window.innerWidth < 900 ? setMenu(false) : setToggle(true);
      return () => {
        window.removeEventListener("resize", () => {});
      };
    });
  }, []);

  const toggleDropdown = (dropdown) => {
    setIsOpen({
      ...isOpen,
      book: dropdown === "book" ? !isOpen.book : false,
    });
  };

  const handleLink = () => {
    navigate("/");
  };

  // Searching

  const handleSearch = debounce((value) => {
    setSearchKeyword(value);
    
    axios
      .get(`http://localhost:5000/search?search=${value}`)
      .then((res) => {
        setSearchSuggestions(res.data.data.content.data);
      })
      .catch((err) => {
        console.log(err.response.data.data.errors[0].message);
      });
  }, 200);

  const handleInputChange = (event) => {
    const value = event.target.value;
    handleSearch(value);
    dispatch(subscribeStudentSearch(value));
    if (event.key === "ArrowDown" && searchSuggestions.length > 0) {
      // move focus to first suggestion
      document.getElementById("suggestion-0").focus();
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setSearchKeyword(suggestion);
    dispatch(subscribeStudentSearch(suggestion));
    navigate("/courses");
    setSearchSuggestions([]);
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSelectSuggestion(searchSuggestions[index]?.name || searchKeyword);
      navigate("/courses");
    } else if (event.key === "ArrowUp" && index > 0) {
      // move focus to previous suggestion
      event.preventDefault();
      document.getElementById(`suggestion-${index - 1}`).focus();
    } else if (
      event.key === "ArrowDown" &&
      index < searchSuggestions.length - 1
    ) {
      event.preventDefault();
      // move focus to next suggestion
      document.getElementById(`suggestion-${index + 1}`).focus();
    }
  };

  return (
    <>
      <div className="z-20  grid grid-cols-6  border w-full mx-auto fixed shadow bg-[#fff]">
        <div className="flex w-[130px] h-[76px]  p-2 align-middle">
          <img src={logo} alt="logo" onClick={handleLink} />
          {menuToggler ? (
            <span
              onClick={() => {
                navigate("/courses");
              }}
              className="cursor-pointer my-1 mt-5 ml-4 mr-1 font-medium"
            >
              Browse
            </span>
          ) : (
            ""
          )}
        </div>
        {menuToggler ? (
          <>
            <div className="my-2 col-span-4">
              <div className="border rounded-xl p-1 mt-1 py-2 flex">
                <div className="my-2 mx-2">
                  <Icon icon="material-symbols:search" />
                </div>
                <div className="grow">
                  <input
                    id="search-input"
                    value={searchKeyword}
                    onChange={handleInputChange}
                    onKeyDown={(event) => handleKeyDown(event, -1)}
                    className="w-full border-none bg-white rounded py-1 text-gray-700bg-white focus:outline-none items-center"
                    type="text"
                    placeholder="Search anything"
                  />
                  {searchSuggestions.length > 0 && (
                    <ul className="bg-white md:w-1/2 p-2 border shadow absolute">
                      {searchSuggestions.map((suggestion, index) => (
                        <li
                          className="bg-white hover:bg-neutral-50 cursor-pointer"
                          key={suggestion.id}
                          id={`suggestion-${index}`}
                          onClick={() =>
                            handleSelectSuggestion(suggestion.name)
                          }
                          onKeyDown={(event) => handleKeyDown(event, index)}
                          tabIndex="0"
                        >
                          {suggestion.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div />
              </div>
            </div>
            <div className="flex justify-between py-1">
              {props.token ? (
                <>
                  <div className="mx-2 bg-white flex   rounded text-md ml-3 p-2 text-neutral-900 ">
                    <div className="grid grid-cols-4 items-center justify-center">
                      {props.student.image ? (
                        <img
                          width="70%"
                          height="70%"
                          src={props.student.image}
                          alt="profile"
                        />
                      ) : (
                        <img
                          width="70%"
                          height="70%"
                          src="https://static.vecteezy.com/system/resources/previews/007/033/146/original/profile-icon-login-head-icon-vector.jpg"
                          alt="profile"
                        />
                      )}
                      {/* dropdown for profile */}
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() => toggleDropdown("book")}
                          className="  font-semibold py-3 px-4  inline-flex items-center"
                        >
                          <span className="block mt-4 lg:inline-block lg:mt-0 text-xs hover:text-gray-400 mr-4">
                            {props.student.name}
                          </span>
                          <svg
                            className="fill-current h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 14l-5-5 1.41-1.41L10 11.17l3.59-3.58L15 9z" />
                          </svg>
                        </button>
                        {isOpen.book && (
                          <div className="absolute z-50 right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl">
                            <Link to="/view-profile">
                              <span className="block px-4 py-2 text-black hover:bg-gray-100 cursor-pointer">
                                Profile
                              </span>
                            </Link>

                            <span className="block px-4 py-2 text-black hover:bg-gray-100 cursor-pointer">
                              Purchased Courses
                            </span>

                            <span className="block px-4 py-2 text-black hover:bg-gray-100 cursor-pointer">
                              Browse Courses
                            </span>
                            <span
                              onClick={handleLogout}
                              className="block px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                            >
                              Logout
                            </span>
                          </div>
                        )}
                      </div>
                      {/* dropdown end */}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <button
                      onClick={props.open1}
                      className="bg-neutral-50 border-2 border-neutral-900 rounded text-md ml-3 mt-3 p-2 text-neutral-900 my-1"
                    >
                      Login
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={props.open}
                      className="bg-slate-800 text-md mx-1 p-2 text-white my-3 border-2 border-neutral-900 rounded"
                    >
                      SignUp
                    </button>
                  </div>
                </>
              )}

              <div className="my-3 mr-2">
                <Icon
                  className="w-11 h-auto border-2 border-neutral-900 rounded"
                  icon="material-symbols:language"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex col-span-5 justify-end">
            <button onClick={handleToggle}>
              <Icon
                className="w-11 h-auto hover:bg-accent-focus"
                icon="material-symbols:menu-rounded"
              />
            </button>
          </div>
        )}
      </div>
      {menuResponsive ? (
        <>
          <div className="z-20 grid grid-row-5 border p-2 w-full mx-auto fixed shadow mt-20 bg-neutral-200">
            <div className="row-span-12 text-center border p-2 hover:bg-accent-focus">
              Browse courses
            </div>

            {props.token ? (
              <>
                <Link to="/view-profile">
                  <div className="row-span-12 text-center border p-2 hover:bg-accent-focus flex justify-center">
                    Profile
                  </div>
                </Link>
                <div className="row-span-12 text-center border p-2 hover:bg-accent-focus flex justify-center">
                  Purchased Courses
                </div>
              </>
            ) : (
              <>
                <div
                  onClick={props.open1}
                  className="row-span-12 text-center border p-2 hover:bg-accent-focus"
                >
                  Login
                </div>
                <div
                  onClick={props.open}
                  className="row-span-12 text-center border p-2 hover:bg-accent-focus"
                >
                  SignUp
                </div>
              </>
            )}

            <div className="row-span-12 text-center border p-2 hover:bg-accent-focus">
              Language
            </div>
            {props.token ? (
              <>
                <div
                  onClick={handleLogout2}
                  className="row-span-12 text-center border p-2 hover:bg-accent-focus"
                >
                  Logout
                </div>
              </>
            ) : (
              ""
            )}
            <div className="row-span-12">
              <div className="mx-3 border rounded-xl p-1 mt-1 py-1 flex">
                <div className="my-2 mx-2">
                  <Icon icon="material-symbols:search" />
                </div>
                <div className="grow">
                  <input
                    className="w-full border-none rounded py-1 bg-neutral-100 text-gray-700 focus:outline-none items-center"
                    type="text"
                    placeholder="Search anything"
                  />
                </div>
                <div />
              </div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
}

export default HeaderLanding;
