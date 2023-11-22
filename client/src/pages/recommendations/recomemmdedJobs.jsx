import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from '@mui/material';

const RecommendedJobs = () => {
  const [recommended, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser._id;
  const [data, setData] = useState();
  const [addOfferModalOpen, setAddOfferModalOpen] = useState(false);
  const fetchCareerPath = async () => {
    try {
      const result = await axios.get(`http://localhost:8800/api/recommendations/careerPath/${currentUser._id}`);
      console.log(result.data.careerPath);
      setData(result.data.careerPath); // Update the state with the fetched data
    } catch (error) {
      console.error("Error fetching career path:", error);
    }
  };

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      try {
        if (data) {
          const response = await axios.get(`http://localhost:8800/api/jobs/career/${data}`);
          setRecommendedJobs(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching recommended jobs:', error);
        setError('Error fetching recommended jobs');
        setLoading(false);
      }
    };

    fetchRecommendedJobs();
  }, [data]);  // Add 'data' to the dependencies array

  useEffect(() => {
    fetchCareerPath(); // Call the fetchCareerPath function when the component mounts
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
    // Check if data is an array
    if (Array.isArray(data)) {
      // Logic to check if an offer has been sent for the specified jobId
      // You may need to fetch and check the status from your API
      // For this example, let's assume you have an offerStatus in your job data
      const job = data.find((item) => item._id === jobId);
      return job && job.offerStatus === 'sent';
    } else {
      // Handle the case where data is not an array (you can return false or handle it based on your requirements)
      console.error('Error: data is not an array');
      return false;
    }
  };
  
  return (
    <div>
      <h2>Recommended Jobs</h2>
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
        <tbody>
          {loading && <tr><td colSpan={13}>Loading recommended jobs...</td></tr>}
          {error && <tr><td colSpan={13}>{error}</td></tr>}
          {!loading && !error && recommended.length === 0 && (
            <tr><td colSpan={13}>No recommended jobs available.</td></tr>
          )}
          {!loading && !error && recommended.length > 0 && (
            recommended.map((item) => (
              <tr key={item._id}>
                <td colSpan={1}>{formatDate(item.createdAt)}</td>
                <td colSpan={1}>
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
                <td>
                  {userId === item.userId ? (
                    <button className="DeleteOffer" onClick={() => handleDeleteOffer(item._id)}>
                      Delete Offer
                    </button>
                  ) : (
                    <button
                      className={`AddOffer ${isOfferSent(item._id) ? 'OfferSent' : ''}`}
                      onClick={() => handleAddOfferModal(item._id)}
                    >
                      {isOfferSent(item._id) ? 'Offer Sent' : 'Add Offer'}
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
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
    </div>
  );
};

export default RecommendedJobs;
