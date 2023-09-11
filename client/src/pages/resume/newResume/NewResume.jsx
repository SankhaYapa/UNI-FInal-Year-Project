import "./newResume.css";

import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export const NewResume = () => {
  const [cvText, setCvText] = useState("");
  const [careerPath, setCareerPath] = useState("");

  const handleSubmit = async () => {
    await axios
      .post("http://localhost:8800/api/careerpath", {
        cvtext: cvText,
      })
      .then((response) => {
        setCareerPath(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <div className="uploadResumePage">
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
            <span className="resumeSubDsc">SELECT A FILE FROM YOUR DEVICE</span>
            <div className="browseArea">
              <div className="browse">
                <div className="uploadIconBox">
                  {/* <FontAwesomeIcon
                    icon={faCloudArrowUp}
                    className="browseIcon"
                  /> */}
                  <span className="browseLink">BROWSE</span>
                </div>
              </div>

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
                {" "}
                Upload My Resume
              </button>
            </div>
            <p>Career Path: {careerPath}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
