import React, { useState } from "react";
import "./Login.scss";
import newRequest from "../../utils/newRequest";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    if (!username.trim()) {
      errors.username = "Username is required";
    }
    if (!password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setValidationErrors(formErrors);
      return;
    }
    setIsLoading(true);
    try {
      const res = await newRequest.post("/auth/login", { username, password });
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      setError(err.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Sign in to your account</h1>
        <div
          className={`form-group ${validationErrors.username ? "error" : ""}`}
        >
          <label htmlFor="username">Username</label>
          <div className="input-container">
            <input
              id="username"
              name="username"
              type="text"
              placeholder="johndoe"
              onChange={(e) => setUsername(e.target.value)}
              className={validationErrors.username ? "error" : ""}
            />
            {validationErrors.username && (
              <div className="error-icon">
                <i className="fas fa-exclamation-circle"></i>{" "}
                {/* Red exclamation icon */}
              </div>
            )}
          </div>
          {validationErrors.username && (
            <div className="error" style={{ marginTop: 10 }}>
              {validationErrors.username}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-container">
            <input
              id="password"
              name="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className={validationErrors.username ? "error" : ""}
            />
            <div className="password-icon">
              {/* <RemoveRedEyeIcon></RemoveRedEyeIcon> */}
            </div>
          </div>
          <div className="forgot-password">
            {validationErrors.password && (
              <div className="error">{validationErrors.password}</div>
            )}
            <dir>Forgot password?</dir>
          </div>
        </div>
        <div className="error">{error && error}</div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loggin in....." : "Login"}
        </button>
        <span>
          Don’t have an account ?<Link to={"/register"}> Join here</Link>
        </span>
      </form>
    </div>
  );
}

export default Login;
