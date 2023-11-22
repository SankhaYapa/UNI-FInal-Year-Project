import "./buildResume.scss";
import Select from "react-select";
import { useState } from "react";
import React, { useEffect } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";


export const BuildResume = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [pythonResponse, setPythonResponse] = useState("");
  const [manualSkill, setManualSkill] = useState("");
  const [showProgress, setShowProgress] = useState(false);
 
  const [resumeData, setResumeData] = useState({
    name: "",
    ambition: "",
    photo: null,
    description: "",
    skills: [],
    experience: "",
    phoneNumber: "",
    email: "",
    address: "",
    linkedin: "",
    achievements: "",
  });

  const handleSelect = (data) => {
    setSelectedOptions(data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResumeData({
      ...resumeData,
      [name]: value,
    });
  };

  const handlePhotoChange = (e) => {
    setResumeData({
      ...resumeData,
      photo: e.target.files[0],
    });
  };

  const addManualSkill = () => {
    if (manualSkill.trim() !== "") {
      setSelectedSkills((prevSkills) => [...prevSkills, manualSkill]);
      setManualSkill("");
    }
  };

  const removeSelectedSkill = (index) => {
    const updatedSkills = [...selectedSkills];
    updatedSkills.splice(index, 1);
    setSelectedSkills(updatedSkills);
  };
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser._id; // Change this depending on where you store the userId
  console.log(userId)
  const handleSubmit = async () => {
    const allSkills = [...selectedOptions, ...selectedSkills];

    // Update resumeData with all skills
    setResumeData((prevData) => ({
      ...prevData,
      skills: allSkills,
    }));

    try {
      setShowProgress(true);
      // Send a request to create a text file on the backend with the user ID and resume data
      const response =  await axios.post(`http://localhost:8800/api/users/create-file/${userId}`, {
        content: JSON.stringify(resumeData),
      });
      setPythonResponse(response.data.recommendations);
      setShowProgress(true);
      console.log(response.data.recommendations)
    } catch (error) {
      console.error("Error creating file:", error);
    }
    finally {
      setWaitingForResponse(false);
      setShowProgress(false);
    }
  };
  

  useEffect(() => {
    console.log(resumeData);
  }, [resumeData]);

  return (
    <div className="add">
       {pythonResponse ? (
          <div className="recomendations">
            <div className="recomendationsWrapper">
              {pythonResponse.recommended_career_path && (
                <div>
                  <h3>Explore the career path we recommend for you, </h3>
                  <h2> {pythonResponse.recommended_career_path}</h2>
                </div>
              )}
              <h3>
                and if you're eager for even more, discover our handpicked
                knowledge improvement courses to further fuel your journey.
              </h3>
              <div className="btnDiv">
                <Link to={"/recommendedCourses"}>
                  <button>Discover</button>
                </Link>
              </div>

              {/* {pythonResponse.courses && pythonResponse.courses.length > 0 && (
              <div>
                <h2>Recommended Courses:</h2>
                <ul>
                  {pythonResponse.courses.map((course, index) => (
                    <li key={index}>
                      <h3>Course Name: {course["Course Name"]}</h3>
                      <p>University: {course["University"]}</p>
                      <p>Difficulty Level: {course["Difficulty Level"]}</p>
                      <p>Course Rating: {course["Course Rating"]}</p>
                      <p>
                        Course URL:{" "}
                        <a
                          href={course["Course URL"]}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {course["Course URL"]}
                        </a>
                      </p>
                      <p>Course Description: {course["Course Description"]}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )} */}
            </div>
          </div>
        ) : (
      <div className="container">
        <h1>Create New Resume</h1>
        <div className="sections">
          <div className="info">
            <label htmlFor="name">Enter Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              onChange={handleInputChange}
            />
            <label htmlFor="ambition">
              Select Your Current Role or Expected Role
            </label>
            <input
              type="text"
              name="ambition"
              placeholder="Enter your Current Role or Expected Role"
              onChange={handleInputChange}
            />
            {/* <label htmlFor="photo">Upload Your Photo</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handlePhotoChange}
            /> */}
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              placeholder="Brief descriptions to introduce your service to customers"
              onChange={handleInputChange}
              cols="0"
              rows="16"
            ></textarea>
            <label htmlFor="achievements">Achievements</label>
            <textarea
              name="achievements"
              id="achievements"
              placeholder="List your achievements and awards"
              onChange={handleInputChange}
              cols="30"
              rows="6"
            ></textarea>
      
          </div>
          <div className="details">
            <label htmlFor="skills">SKILLS</label>
            <div className="selected-skills">
             
              {selectedSkills.map((skill, index) => (
                <div key={index} className="selected-skill">
                  {skill}
                  <label
        className="remove-skill-button"
        onClick={() => removeSelectedSkill(index)}
            >
        x
      </label>
                </div>
              ))}
            </div>
            <div className="input-field-with-button">
              <input
                type="text"
                placeholder="Enter a skill"
                value={manualSkill}
                onChange={(e) => setManualSkill(e.target.value)}
              />
              <button className="add-skill-button" onClick={addManualSkill}>
                Add
              </button>
            </div>
            <label htmlFor="experience">Describe Experience</label>
            <textarea
              name="experience"
              id="experience"
              placeholder="Short description of your service"
              onChange={handleInputChange}
              cols="30"
              rows="10"
            ></textarea>
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              onChange={handleInputChange}
            />
            <label htmlFor="email">Email Address</label>
            <input type="email" name="email" onChange={handleInputChange} />
            <label htmlFor="address">Address</label>
            <input type="text" name="address" onChange={handleInputChange} />
            <label htmlFor="linkedin">LinkedIn Profile</label>
            <input type="text" name="linkedin" onChange={handleInputChange} />
            <button className="create" onClick={handleSubmit}>
              Create
            </button>
            {showProgress&&
            <div className="progress">
                  <CircularProgress className="circularprogrss"/>
            </div>
              }
          
          </div>
        </div>
      </div>
        )}
    </div>
  );
};