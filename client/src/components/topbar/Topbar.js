import "./topbar.css";
import React, { useContext, useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Person from "@mui/icons-material/Person";
import { Chat } from "@mui/icons-material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Topbar() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user, dispatch } = useContext(AuthContext);
  const [foundUser, setFoundUser] = useState(null); // store user
  const [isFound, setIsFound] = useState(false);
  const [input, setInput] = useState("");

  // find user and if found show the searchresultitem div
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get("/users?username=" + input);
        setFoundUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [input, foundUser]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch({ type: "LOGOUT" });
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link style={{ textDecoration: "none" }} to="/">
          {" "}
          <span className="logo">CloneBook</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <SearchIcon className="searchIcon" />
          <input
            placeholder="Search for friends or posts"
            className="searchInput"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
        </div>
        {foundUser && (
          <div className="searchResult">
            <Link
              style={{ textDecoration: "none", color: "inherit" }}
              to={`/profile/${foundUser?.username}`}
            >
              <div className="searchResultItem">{foundUser?.username}</div>{" "}
            </Link>
          </div>
        )}
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <Link style={{ textDecoration: "none", color: "inherit" }} to="/">
            <span className="topbarLink">Home</span>
          </Link>
          <Link
            style={{ textDecoration: "none", color: "inherit" }}
            to={"/profile/" + user?.username}
          >
            <span className="topbarLink">Timeline</span>
          </Link>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBatch">1</span>
          </div>
          <div className="topbarIconItem">
            <Link
              style={{ textDecoration: "none", color: "inherit" }}
              to="/messenger"
            >
              <Chat />
            </Link>
            <span className="topbarIconBatch">2</span>
          </div>
          <div className="topbarIconItem">
            <NotificationsIcon />
            <span className="topbarIconBatch">1</span>
          </div>
        </div>
        <Link to={`/profile/${user.username}`}>
          <img
            src={user.profilePicture || PF + "defaultPP.png"}
            alt=""
            className="topbarImg"
          />
        </Link>
        <button onClick={handleLogout} className="logoutBtn">
          Log Out
        </button>
      </div>
    </div>
  );
}
