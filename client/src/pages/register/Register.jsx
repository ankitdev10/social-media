import axios from "axios";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const cPassword = useRef();
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password.current.value !== cPassword.current.value) {
      cPassword.current.setCustomValidity("Passwords don't match");
      setLoading(false);
      return;
    } else {
      cPassword.current.setCustomValidity("");
    }

    const user = {
      username: username.current.value,
      email: email.current.value,
      password: password.current.value,
    };

    try {
      const res = await axios.post("/auth/register", user);
      navigate("/login");
    } catch (err) {
      setError(err.response ? err.response.data : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">CloneBook</h3>
          <span className="loginDesc">
            Connect with friends and the world around you with CloneBook.
          </span>
        </div>
        <div className="loginRight">
          <form onSubmit={handleClick} className="loginBox">
            <input
              placeholder="Username"
              ref={username}
              type="text"
              className="loginInput"
              required
            />
            <input
              placeholder="Email"
              ref={email}
              type="email"
              className="loginInput"
              required
            />
            <input
              placeholder="Password"
              type="password"
              className="loginInput"
              ref={password}
              required
            />
            <input
              placeholder="Confirm Password"
              type="password"
              className="loginInput"
              ref={cPassword}
              required
            />
            <button type="submit" className="loginBtn" disabled={loading}>
              {loading ? "Loading..." : "Sign Up"}
            </button>
            {error && (
              <span style={{ color: "red" }} className="errorMessage">
                {error}
              </span>
            )}
          </form>
          <Link to="/login">
            <button className="loginRegisterBtn">Log in instead</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
