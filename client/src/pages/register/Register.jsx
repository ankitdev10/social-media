import axios from "axios";
import { useRef } from "react";
import { Link } from "react-router-dom";
import "./register.css";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const cPassword = useRef();

  const handleClick = async (e) => {
    if (password.current.value !== cPassword.current.value) {
      cPassword.current.setCustomValidity("Passwords don't match");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await axios.post("auth/register", user);
        window.location.replace("/login");
      } catch (err) {
        console.log(err);
      }
    }

    e.preventDefault();
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
            <button type="submit" className="loginBtn">
              Sign Up
            </button>
          </form>
          <Link to="/login">
            <button className="loginRegisterBtn">Log in instead</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
