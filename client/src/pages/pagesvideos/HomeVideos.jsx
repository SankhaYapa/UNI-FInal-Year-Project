import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../../components/componentsvideos/Card";
import "./HomeVideos.css";
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 30px;
`;

const HomeVideos = () => {
  const [courses, setcourses] = useState([]);
  useEffect(() => {
    const fetchcourses = async () => {
      const res = await axios.get("http://localhost:8800/api/courses/");
      setcourses(res.data);
      console.log(res.data);
    };
    fetchcourses();
  }, []);
  return (
    <Container>
      <div className="coursesWrapper">
        {courses.map((p) => (
          <Card key={p._id} course={p} />
        ))}
      </div>
    </Container>
  );
};

export default HomeVideos;
