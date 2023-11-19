import React, { useEffect, useState } from 'react';
import newRequest from '../../utils/newRequest';

const RecommendedJobs = () => {
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser._id;
  const [data, setData] = useState();

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
          const response = await newRequest.get(`http://localhost:8800/api/jobs/career/${data}`);
          setRecommendedJobs(response.data.recommendedJobs);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching recommended jobs:', error);
        setError('Error fetching recommended jobs');
        setLoading(false);
      }
    };

    fetchRecommendedJobs();
  }, [userId, data]);  // Add 'data' to the dependencies array

  useEffect(() => {
    fetchCareerPath(); // Call the fetchCareerPath function when the component mounts
  }, []);

  return (
    <div>
      <h2>Recommended Jobs</h2>
      {loading && <p>Loading recommended jobs...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && recommendedJobs.length === 0 && <p>No recommended jobs available.</p>}
      {!loading && !error && recommendedJobs.length > 0 && (
        <ul>
          {recommendedJobs.map((job) => (
            <li key={job._id}>
              <p>{job.jobTitle}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecommendedJobs;