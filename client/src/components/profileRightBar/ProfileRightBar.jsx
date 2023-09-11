import { useContext, useEffect, useState } from "react";
import "./ProfileRightBar.css";
import React from "react";

import { Navigate, useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import HomeVideos from "../../pages/pagesvideos/HomeVideos";
import Gigs from "../../pages/gigs/Gigs";

export const ProfileRightBar = () => {
  const [toggleState, setToggleState] = useState(1);
  const toggleTab = (index) => {
    setToggleState(index);
  };
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  return (
    <div className="container">
      <div className="bloc-tabs">
        <button
          className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(1)}
        >
          All Courses
        </button>
        <button
          className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(2)}
        >
          My Learning
        </button>
        <button
          className={toggleState === 3 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(3)}
        >
          Gigs
        </button>
        <button
          className={toggleState === 4 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(4)}
        >
          Recommended Jobs
        </button>
      </div>

      <div className="content-tabs">
        <div
          className={toggleState === 1 ? "content  active-content" : "content"}
        >
          <HomeVideos></HomeVideos>
        </div>

        <div
          className={toggleState === 2 ? "content  active-content" : "content"}
        >
          My Learnings
        </div>

        <div
          className={toggleState === 3 ? "content  active-content" : "content"}
        >
          <div className="gigcreatebuttonwrapper">
            {/* <button className="gigcreatebutton" onClick={handleButton}>
              Create Gig +
            </button> */}

            <Gigs></Gigs>
          </div>
          <div className="TimelineContainer"></div>
        </div>
      </div>
    </div>
  );
};
