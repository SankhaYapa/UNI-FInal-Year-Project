import { useContext, useEffect, useState } from "react";
import "./ProfileRightBar.css";
import React from "react";

import { Navigate, useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import HomeVideos from "../../pages/pagesvideos/HomeVideos";
import Gigs from "../../pages/gigs/Gigs";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import GigCard from "../gigCard/GigCard";

export const ProfileRightBar = () => {
  const [toggleState, setToggleState] = useState(1);
  const toggleTab = (index) => {
    setToggleState(index);
  };

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs"],
    queryFn: () =>
      newRequest.get(`/gigs?userId=${currentUser._id}`).then((res) => res.data),
  });
  console.log();
  return (
    <div className="container">
      <div className="bloc-tabs">
        <button
          className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(1)}
        >
          <span>All Courses</span>
        </button>
        <button
          className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(2)}
        >
          <span>My Learning</span>
        </button>
        <button
          className={toggleState === 3 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(3)}
        >
          <span>Gigs</span>
        </button>
        <button
          className={toggleState === 4 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(4)}
        >
          <span>Recommended Jobs</span>
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
            <button className="gigcreatebutton">Create Gig +</button>
          </div>
          <div className="cards">
            {isLoading
              ? "Loading..."
              : error
              ? "Something went wrong!"
              : data.map((gig) => <GigCard key={gig._id} item={gig} />)}
          </div>
          <div className="TimelineContainer"></div>
        </div>
      </div>
    </div>
  );
};
