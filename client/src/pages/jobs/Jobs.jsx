import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";

import "./jobs.css";
import Table from "react-bootstrap/Table";
import date from "date-and-time";
import { useNavigate } from "react-router-dom";

export const Jobs = () => {
  const [open, setOpen] = useState(false);
  const [textDecriptionAreaCount, setTextDecriptionAreaCount] = useState("0");

  const [duration, setDuration] = useState("");
  const desc = useRef();
  const budget = useRef();

  const navigate = useNavigate();

  const desctiptionCount = (e) => {
    console.log("event value:", e);
    setTextDecriptionAreaCount(e.target.value.length);
  };
  const handleClick = () => {
    setOpen(!open);
  };
  const handleClickForm = async (e) => {
    e.preventDefault();
    const data = {
      userId: user._id,
      desc: desc.current.value,
      days: duration,
      budget: budget.current.value,
    };
    console.log(data);
    try {
      await axios.post("/jobs", data);
      handleClick();
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const [data, setData] = useState([]);
  const [createdAtDate, setCreatedAtDate] = useState(null);
  const fetchData = async () => {
    const result = await axios.get("/jobs");
    setData(result.data);
    console.log(result);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    // const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const month = date.toLocaleString("en-us", { month: "short" });
    const day = date.getDate().toString().padStart(2, "0");
    return `${month} ${day} , ${year}`;
  };
  return (
    <div>
      <div className="jobs">
        <div className="jobsWrapper">
          <div className="addjobdiv">
            <span className="TitleJobs">BROWSE US JOBS TOP JOB SEARCHES:</span>

            <button className="addJob" onClick={handleClick}>
              Add Jobs +
            </button>
            {open && (
              <form
                action="
                "
                onSubmit={handleClickForm}
                className="dialog-form"
              >
                <div className="AddJobTitle">
                  <span className="TitleJobs">Add a Job</span>
                </div>
                <div className="addJobLables">
                  <span>Describe the service you are looking to purchase</span>
                </div>
                <textarea
                  name=""
                  id=""
                  cols="30"
                  rows="2"
                  className="textAreaJob"
                  maxLength={2500}
                  onChange={desctiptionCount}
                  ref={desc}
                ></textarea>
                <div className="CountLetters">
                  <p className=""> {`${textDecriptionAreaCount}/2500`} </p>
                </div>

                <div className="addJobLables">
                  <span>Delivery Time : </span>

                  <select
                    className="Days"
                    onChange={(e) => setDuration(e.target.value)}
                    value={duration}
                  >
                    <option value="" disabled={duration === ""}>
                      Days
                    </option>
                    <option value="1">1 Day</option>
                    <option value="3">3 Days</option>
                    <option value="5">5 Days</option>
                    <option value="7">7 Days</option>
                    <option value="10">10 Days</option>
                    <option value="14">14 Days</option>
                    <option value="21">21 Days</option>
                    <option value="30">30 Days</option>
                  </select>
                </div>
                <div className="addJobLables">
                  <span>Budget : </span>

                  <input type="text" className="Days" ref={budget} />
                  <span> $</span>
                </div>
                <div className="postajob">
                  <button className="postajobButton" type="submit">
                    Post a Job
                  </button>
                </div>
              </form>
            )}
          </div>
          <div>
            <Table striped hover size="sm" className="TableBoost">
              <thead>
                <tr className="text-center">
                  <th colSpan={1}>Date</th>
                  <th colSpan={1}>Buyer</th>
                  <th colSpan={8}>Request</th>
                  <th colSpan={1}>Duration</th>
                  <th colSpan={1}>Budget</th>
                  <th>Action</th>
                </tr>
              </thead>
              {data.map((item) => (
                <tbody>
                  <tr>
                    <td colSpan={1}>{formatDate(item.createdAt)}</td>
                    <td colSpan={1}>
                      {" "}
                      <img
                        src={
                          user.profilePicture
                            ? PF + user.profilePicture
                            : PF + "person/profile.jpg"
                        }
                        alt=""
                        className="navBarImg"
                      />
                      &nbsp;&nbsp;{user.username}
                    </td>
                    <td colSpan={8}>{item.desc}</td>
                    <td colSpan={1}>{item.days} days</td>
                    <td colSpan={1}>${item.budget}</td>
                    <th>
                      <button className="AddOffer">Add offer</button>
                    </th>
                  </tr>
                </tbody>
              ))}
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};
