import React, { useState, useEffect } from "react";
import axios from "axios";
import getCurrentUser from "../../utils/getCurrentUser";
import "./recomendationCources.scss";

// Define the StarRating component
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= rating ? "star filled" : "star empty"}>
        ★
      </span>
    );
  }

  return (
    <div className="star-rating">
      <div className="stars">{stars}</div>
      <span className="rating-value">{rating}</span>
    </div>
  );
};

export const RecomendedCources = () => {
  const [courses, setCourses] = useState([]);
  const currentUser = getCurrentUser();
  console.log(currentUser._id);

  useEffect(() => {
    // Define the URL of your server endpoint
    const apiUrl = `http://localhost:8800/api/courses/${currentUser._id}`; // Replace with your actual endpoint

    // Fetch the data when the component mounts
    axios
      .get(apiUrl)
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  console.log(courses);

  const getRandomColor = () => {
    // Generate a random color in hexadecimal format
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  };

  return (
    <div>
      <h1>Recommended Courses</h1>
      {courses.map((course, index) => (
        <div key={index} className="course-list">
          {course.courses.map((c, i) => (
            <div key={i} className="course-card">
              <div
                className="course-name"
                style={{
                  width: "100%", // Adjust the width as needed
                  height: "150px", // Adjust the height as needed
                  backgroundColor: getRandomColor(),
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center", // Random background color
                }}
              >
                <h2>{c.name}</h2>
              </div>
              <p>
                <StarRating rating={c.courseRating} />
              </p>
              <p className="description">Description: {c.courseDescription}</p>
              <p>University: {c.university}</p>
              <p>Difficulty Level: {c.difficultyLevel}</p>
              <p>To be a: {course.careerPath}</p>
              <div>
                <a href={c.courseURL} target="_blank" rel="noopener noreferrer">
                  Learn More
                </a>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
