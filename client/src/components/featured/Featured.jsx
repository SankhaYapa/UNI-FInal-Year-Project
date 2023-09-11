import React from "react";
import { useNavigate } from "react-router-dom";
import "./Featured.scss";

function Featured() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("./uploadResume");
  };
  return (
    <div className="featured">
      <div className="container">
        <div className="left">
          <h1>
            START TO BUILD YOUR <span>CAREER…</span> FAST!
          </h1>

          <p>
            {" "}
            Upload by skills. View courses.Complete Courses. One-click apply.
          </p>
        </div>
        <div className="right">
          <div className="upload">
            <p>MAKE YOUR SEARCH EASY.</p>
            <h1>UPLOAD YOUR RESUME</h1>
            <p>Don't have a resume? Build one in 3 steps.</p>
            <button onClick={handleClick}>Upload / Build Resume</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Featured;
