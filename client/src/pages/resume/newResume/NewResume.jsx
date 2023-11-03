import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import newRequest from "../../../utils/newRequest";
import LinearProgressWithLabel from "../../../utils/LinearIndeterminate.jsx";
import "./newResume.scss";
import { LinearProgress } from "@mui/material";
const NewResume = () => {
  const [cvText, setCvText] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [pythonResponse, setPythonResponse] = useState("");
  const fileInputRef = useRef(null);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [progress, setProgress] = useState(0); // Progress state
  const [showProgress, setShowProgress] = useState(false);
  const navigate = useNavigate();
  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Additional checks or validations can be performed here
      setCvFile(selectedFile);
    }
  };

  // Get the userId from localStorage or sessionStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser._id; // Change this depending on where you store the userId

  const handleSubmit = async () => {
    if (!cvFile) {
      alert("Please select a CV file.");
      return;
    }

    const formData = new FormData();
    formData.append("cvFile", cvFile);

    try {
      setShowProgress(true);
      const response = await newRequest.post(
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

      console.log(response.data.message);

      setPythonResponse(response.data.recommendations);

      setShowProgress(true);
    } catch (error) {
      console.error("Error uploading CV:", error);
    } finally {
      setWaitingForResponse(false);
      setShowProgress(false);
    }
  };
  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };
  return (
    <div>
      <div className="uploadResumePage">
        {pythonResponse ? (
          <div className="recomendations">
            <div className="recomendationsWrapper">
              {pythonResponse.career_path && (
                <div>
                  <h3>Explore the career path we recommend for you, </h3>
                  <h2> {pythonResponse.career_path}</h2>
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
          <div className="uploadResumeContainer">
            <div className="uploadResumeDiv">
              <Link to="/uploadResume">
                <span className="back">{"< "}Back</span>
              </Link>
              <h1 className="resumeTitle">UPLOAD A RESUME</h1>
              <span className="resumeDsc">
                We’ll store your resume to enable you to recommend courses that
                match what you’re looking for!
              </span>
              <br></br>
              <br></br>
              <span className="resumeSubDsc">
                SELECT A FILE FROM YOUR DEVICE
              </span>
              <div className="browseArea">
                <div className="browse" onClick={handleBrowseClick}>
                  <div className="uploadIconBox">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      style={{ display: "none" }}
                    />
                    <span className="browseLink">BROWSE</span>
                  </div>
                  {cvFile && (
                    <span className="filename">
                      Selected file: {cvFile.name}
                    </span>
                  )}
                </div>
                <div className="or">or</div>
                <textarea
                  className="browseInput"
                  name=""
                  id=""
                  cols="30"
                  rows="10"
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                ></textarea>
              </div>
              <div className="uploadResumeButtonDiv">
                <button className="uploadResumeButton" onClick={handleSubmit}>
                  Upload My Resume
                </button>
              </div>
              {showProgress && <LinearProgress />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewResume;
