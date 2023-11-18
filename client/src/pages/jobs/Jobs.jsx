import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./jobs.css";
import Table from "react-bootstrap/Table";
import date from "date-and-time";
import { useNavigate } from "react-router-dom";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";   
export const Jobs = () => {
  const [open, setOpen] = useState(false);
  const [textDecriptionAreaCount, setTextDecriptionAreaCount] = useState("0");
  const [addOfferModalOpen, setAddOfferModalOpen] = useState(false);
  const [duration, setDuration] = useState("");
  const desc = useRef();
  const budget = useRef();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const desctiptionCount = (e) => {
    console.log("event value:", e);
    setTextDecriptionAreaCount(e.target.value.length);
  };
  const handleClick = () => {
    setOpen(!open);
  };
  const [selectedJobId, setSelectedJobId] = useState(null);
  const handleAddOfferModal = (jobId) => {
    setAddOfferModalOpen(!addOfferModalOpen);
    setSelectedJobId(jobId);
  };
console.log(selectedJobId)
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
      await axios.post("http://localhost:8800/api/jobs", data);
      handleClick();
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };
  const offerPrice=useRef()
  const handleAddOffer = async () => {
    // Prevent the default form submission behavior
    // (assuming this function is called in response to a form submission)
    // e.preventDefault(); // Remove this line, it's not needed here

    // Here you can add logic to handle the offer submission
    const offerData = {
      userId: user._id,
      jobId: selectedJobId, // Use the selected job id
      offerPrice: offerPrice.current.value,
    };
console.log(offerData)
    try {
      // Submit the offer
      await axios.post(`http://localhost:8800/api/jobs/offer/${jobId}`, offerData);
      // Close the Add Offer modal
      setAddOfferModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  
  const [data, setData] = useState([]);
  const [createdAtDate, setCreatedAtDate] = useState(null);
  const fetchData = async () => {
    try {
      const result = await axios.get("http://localhost:8800/api/jobs");
      const jobsWithUserDetails = await Promise.all(
        result.data.map(async (item) => {
          const userResult = await axios.get(
            `http://localhost:8800/api/users/${item.userId}`
          );
          return {
            ...item,
            user: userResult.data, // Assuming your user details are available in userResult.data
          };
        })
      );
      setData(jobsWithUserDetails);
    } catch (error) {
      console.log(error);
    }
  };
console.log(data)
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
  const isOfferSent = (jobId) => {
    // Logic to check if an offer has been sent for the specified jobId
    // You may need to fetch and check the status from your API
    // For this example, let's assume you have an offerStatus in your job data
    const job = data.find((item) => item._id === jobId);
    return job && job.offerStatus === 'sent';
  };
  const handleDeleteOffer = async (jobId, offerId) => {
    try {
      await axios.delete(`http://localhost:8800/api/jobs/`+
        jobId 
      );
      fetchData(); // Refresh the data after deleting the offer
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="jobs">
        <div className="jobsWrapper">
       
            
            {open && (
              <div className="addjobdiv">
               
              <form
                action="
                "
                onSubmit={handleClickForm}
                className="dialog-form"
              >
                <div className="AddJobTitle">
                  <span className="TitleJobs">Add a Job</span>
                </div>  <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        
                <div className="addJobLables">
                  <span>Describe the service you are looking to purchase</span>
                </div>
                <textarea
                  name=""
                  id=""
                  cols="30"
                  rows="4"
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
              </div>
            )}
                 {addOfferModalOpen && (
            <div className="addjobdiv">
              <form className="dialog-form">
                <div className="AddOfferTitle">
                  <span className="TitleJobs">Add an Offer</span>
                </div>
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  className="rClose"
                  onClick={() => setAddOfferModalOpen(false)}
                />
                <div className="addJobLables">
                <span>Description: </span> </div>
                 <textarea
                  name=""
                  id=""
                  cols="30"
                  rows="4"
                  className="textAreaJob"
                  maxLength={500}
                 
               
                ></textarea>
                
                <div className="addJobLables">
                  <span>Offer Price: </span>
                  <input type="text" className="Days" ref={offerPrice}/>
                </div>
                <div className="addOfferButton">
                  <button type="submit" className="postajobButton"  onClick={handleAddOffer}>Submit Offer</button>
                </div>
              </form>
            </div>
          )}
          <div>
            <div className="jobtitlediv">
            <span className="TitleJobs">BROWSE US JOBS TOP JOB SEARCHES:</span>

              <button className="addJob" onClick={handleClick}>
              Add Jobs +
            </button>
            </div>
          
            <Table striped hover size="sm" className="TableBoost">
   
              <thead className="header">
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

                      <div className="tddiv">
                      <img
                          src={
                            item.user && item.user.img
                              ? item.user.img
                              : "http://localhost:5173/img/noavatar.jpg"
                          }
                          alt=""
                          className="navBarImg"
                        />
                        &nbsp;&nbsp;
                        {item.user && item.user.username}
                      </div>
                     
                    </td>
                    <td colSpan={8}>{item.desc}</td>
                    <td colSpan={1}>{item.days} days</td>
                    <td colSpan={1}>${item.budget}</td>
                    <th>
                    {user._id === item.userId ? (
                  <button className="DeleteOffer" onClick={() => handleDeleteOffer(item._id)}>
                  Delete Offer
                </button>
                ) : (
                  <button
                        className={`AddOffer ${
                          isOfferSent(item._id) ? 'OfferSent' : ''
                        }`}
                        onClick={() => handleAddOfferModal(item._id)}
                      >
                        {isOfferSent(item._id) ? 'Offer Sent' : 'Add Offer'}
                      </button>
                )}
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
