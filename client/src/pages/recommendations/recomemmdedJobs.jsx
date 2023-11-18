import React, { useEffect, useState } from 'react';
import newRequest from '../../utils/newRequest';

const RecommendedJobs = () => {
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId=currentUser._id
  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      try {
        const response = await newRequest.get(`http://localhost:8800/api/users/recommendJobs/${userId}`);
        setRecommendedJobs(response.data.recommendedJobs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recommended jobs:', error);
        setError('Error fetching recommended jobs');
        setLoading(false);
      }
    };

    fetchRecommendedJobs();
  }, [userId]);

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
              {/* Add more details as needed */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecommendedJobs;
