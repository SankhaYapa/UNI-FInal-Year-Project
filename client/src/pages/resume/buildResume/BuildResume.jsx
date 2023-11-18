import "./buildResume.scss";
import Select from "react-select";
import { useState } from "react";
import React, { useEffect } from "react";
import axios from "axios";


export const BuildResume = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [manualSkill, setManualSkill] = useState("");
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
      // Send a request to create a text file on the backend with the user ID and resume data
      await axios.post(`http://localhost:8800/api/users/create-file/${userId}`, {
        content: JSON.stringify(resumeData),
      });
  
    } catch (error) {
      console.error("Error creating file:", error);
    }
  };
  

  useEffect(() => {
    console.log(resumeData);
  }, [resumeData]);

  return (
    <div className="add">
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
            <label htmlFor="photo">Upload Your Photo</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handlePhotoChange}
            />
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
          </div>
        </div>
      </div>
    </div>
  );
};