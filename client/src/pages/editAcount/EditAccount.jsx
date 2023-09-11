import Select from "react-select";
import React, { useContext, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import "./editAccount.scss";
import axios from "axios";
export const EditAccount = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const username = useRef();
  const email = useRef();
  const desc = useRef();
  const skills = useRef();
  const city = useRef();
  const phone = useRef();
  const education = useRef();
  const navigate = useNavigate();
  console.log(user.username);
  /////
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    phone: user.phone,
    city: user.city,
    desc: user.desc,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };
  /////
  const handleClickForm = async (e) => {
    e.preventDefault();
    const selectedValues = selectedOptions.map((option) => option.value);
    const data = {
      userId: user._id,
      username: username.current.value,
      email: email.current.value,
      desc: desc.current.value,
      skills: selectedValues,
      city: city.current.value,
      phone: phone.current.value,
      education: education.current.value,
    };
    console.log(data);
    try {
      await axios.put("/users/" + user._id, data);
      navigate("/profile/" + user.username);
    } catch (error) {
      console.log(error);
    }
  };
  // React state to manage selected options
  const [selectedOptions, setSelectedOptions] = useState();

  // Array of all options
  const optionList = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "react", label: "React" },
    { value: "nodejs", label: "Node.js" },
    { value: "mongodb", label: "MongoDB" },
    { value: "sql", label: "SQL" },
    { value: "aws", label: "AWS" },
    { value: "docker", label: "Docker" },
  ];

  // Function triggered on selection
  function handleSelect(data) {
    setSelectedOptions(data);
  }
  return (
    <div>
      <div className="EditProfileWrapper">
        <div className="EditProfile">
          <label htmlFor="" style={{ fontSize: "18px" }}>
            Need to update your public profile?
          </label>
          <Link to={`/profile/${user.username}`}>
            <label htmlFor="">Go to My Profile</label>
          </Link>
          <form
            action="
                "
            onSubmit={handleClickForm}
          >
            <div className="addJobLables">
              <span>FULL NAME</span>
            </div>
            <input
              type="text"
              className="inputAdvice"
              defaultValue={user.username}
              onChange={handleChange}
              ref={username}
            />
            <div className="addJobLables">
              <span>EMAIL</span>
            </div>
            <input
              type="email"
              className="inputAdvice"
              defaultValue={user.email}
              onChange={handleChange}
              ref={email}
            />
            <div className="addJobLables">
              <span>ADDRESS</span>
            </div>
            <input
              type="text"
              className="inputAdvice"
              defaultValue={user.city}
              onChange={handleChange}
              ref={city}
            />
            <div className="addJobLables">
              <span>PHONE NUMBER</span>
            </div>
            <input
              type="text"
              className="inputAdvice"
              defaultValue={user.phone}
              onChange={handleChange}
              ref={phone}
            />
            <div className="addJobLables">
              <span>DESCRIPTION</span>
            </div>
            <textarea
              className="inputAdvice"
              name=""
              id=""
              cols="30"
              rows="10"
              defaultValue={user.desc}
              onChange={handleChange}
              ref={desc}
            ></textarea>
            <div className="addJobLables">
              <span>SKILLS</span>
            </div>
            <Select
              options={optionList}
              placeholder="Select Skils"
              value={selectedOptions}
              onChange={handleSelect}
              isSearchable={true}
              isMulti
              className="inputAdvice"
              defaultValue={user.skills}
            />
            <div className="addJobLables">
              <span>EDUCATION</span>
            </div>
            <select className="inputAdvice" ref={education}>
              <option value="" disabled selected>
                -Select Education-
              </option>
              <option value="No formal education">No formal education</option>
              <option value="Primary education">Primary education</option>
              <option value="Secondary education">
                Secondary education or high school
              </option>
              <option value="GED">GED</option>
              <option value="Vocational qualification">
                Vocational qualification
              </option>
              <option value="Bachelor's degree">Bachelor's degree</option>
              <option value="Master's degree">Master's degree</option>
              <option value="Doctorate or higher">Doctorate or higher</option>
            </select>
            <div className="postaAdvicer">
              <button className="postaAdvicerButton" type="submit">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
