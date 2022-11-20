import { useRef } from "react";
import "./login.css";
import { loginCall } from "../../apiCalls";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@mui/material";
import {Link} from "react-router-dom"
import { useState } from "react";

export default function Login() {
  const email = useRef();
  const password = useRef();
  const { user, isFetching, error, dispatch } = useContext(AuthContext);
  const [err, setErr] = useState(false)

  const handleClick = (e) => {
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
    if(error){
     setErr(true) 
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
          <form className="loginBox" onSubmit={handleClick}>
            <input
              ref={email}
              placeholder="Email"
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
            <button type="submit" className="loginBtn">
              {" "}
              {isFetching ? (
                <CircularProgress color="inherit" size="15px" />
              ) : (
                "Log in"
              )}
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <Link to="/register">
              <button className="loginRegisterBtn">
                {" "}
                {isFetching ? (
                  <CircularProgress color="inherit" size="15px" />
                ) : (
                  "Create new account"
                )}
              </button>
            </Link>
          {err && <span style={{color: "red", textAlign: "center"}}>Please check your credentials and try again</span> }

          </form>
        </div>
      </div>
    </div>
  );
}
