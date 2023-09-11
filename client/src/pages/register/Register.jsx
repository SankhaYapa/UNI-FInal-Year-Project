import React, { useRef, useState } from "react";
import upload from "../../utils/uploadFirebase";
import "./Register.scss";
import newRequest from "../../utils/newRequest";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Login from "../login/Login";
import storage from "../../utils/firebase";
import uploadFirebase from "../../utils/uploadFirebase";

function Register() {
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    country: "",
    isSeller: false,
    desc: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  console.log(user);
  const handleChange = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const navigate = useNavigate();
  const handleSeller = (e) => {
    setUser((prev) => {
      return { ...prev, isSeller: e.target.checked };
    });
  };

  const validateForm = () => {
    let valid = true;
    const updateErrors = {
      username: "",
      email: "",
      password: "",
      country: "",
    };
    if (user.username.trim() === "") {
      updateErrors.username = "Username is required";
      valid = false;
    }
    if (!user.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
      updateErrors.email = "Invalid email address";
      valid = false;
    }
    if (user.password.length < 6) {
      updateErrors.password = "Password must be at least 6 characters";
      valid = false;
    }
    if (user.country.trim() === "") {
      updateErrors.country = "please add country";
      valid = false;
    }
    setErrors(updateErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      // Form validation failed, do not proceed with submission
      return;
    }
    try {
      // Upload the file and get the URL
      const url = await uploadFirebase(file);

      // Register the user with the provided information, including the profile picture URL
      setIsLoading(true);
      await newRequest.post("/auth/register", {
        ...user,
        img: url,
      });

      // Redirect to another page after successful registration
      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // const handleSuccessClose = () => {
  //   setShowSuccess(false);
  //   window.location.reload();
  //   setTimeout(() => {
  //     setShowLogin(true);
  //   }, 3000);
  // };

  // const handleLoginClose = () => {
  //   setShowLogin(false);
  // };

  // const routeChange = () => {
  //   navigate("/login");
  // };
  return (
    <div className="reg-div">
      <form onSubmit={handleSubmit}>
        <div className="left">
          <h2>Create a new account</h2>
          <label htmlFor="">Username</label>
          <input
            name="username"
            type="text"
            placeholder="Saman Perera"
            onChange={handleChange}
            className={errors.username ? "error" : ""}
          />
          {errors.username && <div className="error">{errors.username}</div>}
          <label htmlFor="">Email</label>
          <input
            name="email"
            type="email"
            placeholder="email"
            onChange={handleChange}
            className={errors.username ? "error" : ""}
          />
          {errors.email && <div className="error">{errors.email}</div>}
          <label htmlFor="">Password</label>
          <input
            name="password"
            type="password"
            onChange={handleChange}
            className={errors.username ? "error" : ""}
          />
          {errors.password && <div className="error">{errors.password}</div>}
          <label htmlFor="">Profile Picture</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <label htmlFor="">Country</label>
          <input
            name="country"
            type="text"
            placeholder="Sri Lanka"
            onChange={handleChange}
            className={errors.username ? "error" : ""}
          />{" "}
          {errors.country && <div className="error">{errors.country}</div>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Register in....." : "Register"}
          </button>
        </div>
        <div className="right">
          <h2>I want to become a skill seller</h2>
          <div className="toggle">
            <label htmlFor="">Activate the skill seller account</label>
            <label className="switch">
              <input type="checkbox" onChange={handleSeller} />
              <span className="slider round"></span>
            </label>
          </div>
          <label htmlFor="">Phone Number</label>
          <input
            name="phone"
            type="text"
            placeholder="+94 234 567 89"
            onChange={handleChange}
          />
          <label htmlFor="">Description</label>
          <textarea
            placeholder="A short description of yourself"
            name="desc"
            id=""
            cols="30"
            rows="10"
            onChange={handleChange}
          ></textarea>
          <span>
            Already a member?
            <Link to={"/login"}> Sign In</Link>
          </span>
        </div>
      </form>
      {/* {showSuccess && (
        <div className="success-message">
          <p>Registration Successful!</p>
          <button onClick={handleSuccessClose}>Close</button>
        </div>
      )} */}
      {/* {showLogin && <Login onClose={handleLoginClose} />} */}
    </div>
  );
}

export default Register;
