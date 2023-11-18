import "./ProfileLeftBar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartArrowDown,
  faCartPlus,
  faCarTunnel,
  faEdit,
  faLocation,
  faLocationPin,
  faMailBulk,
  faMailReply,
  faMailReplyAll,
  faMessage,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
export const ProfileLeftBar = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const handleButton = () => {
    navigate("./editprofile", { state: { currentUser } });
  };const [data, setData] = useState();
  console.log(currentUser._id)
  const fetchCareerPath = async () => {
    try {
      const result = await axios.get(`http://localhost:8800/api/recommendations/careerPath/${currentUser._id}`);
      console.log(result.data.careerPath)
      setData(result.data.careerPath); // Update the state with the fetched data
    } catch (error) {
      console.error("Error fetching career path:", error);
    }
  };

  useEffect(() => {
    fetchCareerPath(); // Call the fetchCareerPath function when the component mounts
  }, []);
  console.log(data)
  return (
    <div className="profielLeft">
      {currentUser.username == currentUser.username && (
        <div className="ProfileEdit">
          <FontAwesomeIcon
            icon={faEdit}
            size="lg"
            onClick={handleButton}
          ></FontAwesomeIcon>
        </div>
      )}
      <div className="imagewrapper">
        <img
          src={
            currentUser.img || "http://127.0.0.1:5173/public/img/noavatar.jpg"
          }
          alt=""
        />
      </div>

      <h1 className="Username">{currentUser.username}</h1>
      <h1 className="Username">{currentUser.isSeller}</h1>

      <hr />

      {currentUser.username !== currentUser.username && (
        <div className="AreaButtons">
          <button className="ContactBtn" onClick={handleClick}>
            {/* <FontAwesomeIcon icon={faCartArrowDown}></FontAwesomeIcon> */}
            {/* {followed ? "Unfollow" : "Followed"} */}
          </button>
          <button className="ContactBtn">
            {/* <FontAwesomeIcon icon={faMessage}></FontAwesomeIcon> */}
            {" Contact Me"}
          </button>
        </div>
      )}
      <div className="RecommendedPath">
        <div>
          {/* <FontAwesomeIcon icon={faLocationPin}></FontAwesomeIcon> */}
          <h4> Recomeneded Path</h4>
        </div>
        <span>{data}</span>
      </div>

      <hr />
      <div className="Location">
        <div>
          {/* <FontAwesomeIcon icon={faLocationPin}></FontAwesomeIcon> */}
          <span> From</span>
        </div>
        <span>{currentUser.country}</span>
      </div>
      <div className="Location">
        <div>
          {/* <FontAwesomeIcon icon={faPhone}></FontAwesomeIcon> */}
          <span> Phone</span>
        </div>
        <span>{currentUser.phone}</span>
      </div>
      <div className="Location">
        <div>
          {/* <FontAwesomeIcon icon={faMailBulk}></FontAwesomeIcon> */}
          <span> Mail</span>
        </div>
        <span className="subdetails">{currentUser.email}</span>
      </div>
      <div style={{ marginTop: "10px", marginBottom: "10px" }}>
        <h4 className="Description">Description</h4>
        <span>
          I am passionate about my work and believe that technology can play a
          transformative role in the world. I am excited to see what the future
          holds for mobile app development, and I am committed to making
          Finjineers a leader in this field.
        </span>
      </div>
      <div className="SkillsDiv">
        <h4 className="Description">Skills</h4>

        <div className="Skills">PHP</div>
        <div className="Skills">JAVA</div>
        <div className="Skills">FLUTTER</div>
      </div>
      {/* <div className="SkillsDiv">
        <h4 className="Description">Education</h4>
        <h5 className="Description">{user.education}</h5>
        <h5>Indonesian Institute of the Arts, Indonesia, Graduated 2019</h5>
      </div> */}
    </div>
  );
};
