// RecommendationsPage.js
import React from "react";
import { useLocation } from "react-router-dom";

export default function RecommendationsPage() {
  const location = useLocation();
  const pythonResponse = location.state && location.state.pythonResponse;
  console.log("pythonResponse in RecommendationsPage:", pythonResponse);

  return (
    <div>
      {pythonResponse && pythonResponse.career_path && (
        <div>
          <h2>Recommended Career Path: {pythonResponse.career_path}</h2>
        </div>
      )}
      {pythonResponse &&
        pythonResponse.courses &&
        pythonResponse.courses.length > 0 && (
          <div>
            <h2>Recommended Courses:</h2>
            <ul>
              {pythonResponse.courses.map((course, index) => (
                <li key={index}>
                  <h3>Course Name: {course["Course Name"]}</h3>
                  <p>University: {course["University"]}</p>
                  <p>Difficulty Level: {course["Difficulty Level"]}</p>
                  <p>Course Rating: {course["Course Rating"]}</p>
                  <p>
                    Course URL:{" "}
                    <a
                      href={course["Course URL"]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {course["Course URL"]}
                    </a>
                  </p>
                  <p>Course Description: {course["Course Description"]}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
    </div>
  );
}
