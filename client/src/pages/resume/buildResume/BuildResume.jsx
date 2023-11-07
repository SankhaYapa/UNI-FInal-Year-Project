import "./buildResume.scss";
import Select from "react-select";
import { useState } from "react";
import React, { useEffect } from "react";

export const BuildResume = () => {
  // React state to manage selected options
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [manualSkill, setManualSkill] = useState(""); // State to store manually input skill

  const addManualSkill = () => {
    if (manualSkill.trim() !== "") {
      setSelectedSkills((prevSkills) => [...prevSkills, manualSkill]);
      setManualSkill(""); // Clear the manualSkill input field
    }
  };
  // Function triggered on selection
  function handleSelect(data) {
    setSelectedOptions(data);
  }

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

  useEffect(() => {
    console.log(resumeData);
  }, [resumeData]);
  const handleSubmit = async () => {
    if (!cvFile) {
      alert("Please select a CV file.");
      return;
    }

    const formData = new FormData();
    formData.append("cvFile", cvFile);

    try {
      setShowProgress(true);

      // Send the PDF file to your server for storage
      const response = await axios.post(
        `/users/upload-cv?userId=${userId}`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        }
      );

      // Handle the response from the server
      setPythonResponse(response.data.recommendations);

      // Generate and download the PDF
      const pdfResponse = await axios.post("/generate-pdf", resumeData, {
        responseType: "blob",
      });

      const blob = new Blob([pdfResponse.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      a.click();
    } catch (error) {
      console.error("Error uploading CV:", error);
    } finally {
      setWaitingForResponse(false);
      setShowProgress(false);
    }
  };
  const removeSelectedSkill = (index) => {
    const updatedSkills = [...selectedSkills];
    updatedSkills.splice(index, 1);
    setSelectedSkills(updatedSkills);
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