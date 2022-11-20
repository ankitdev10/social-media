import { useEffect, useState } from "react";
import "./closefriend.css";
import axios from "axios";
import { Link } from "react-router-dom";
export default function CloseFriend({ user }) {
  const [friends, setFriends] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  // get friends of user

  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get("/users/friends/" + user._id);
      setFriends(res.data);
    
    };
    getFriends();
  }, []);

  return (
    <div>
      {friends.map((f) => (
        <Link
          style={{ textDecoration: "none", color: "inherit" }}
          to={"/profile/"+f.username}
        >
          <li className="sideBarFriend">
            <img
              src={
                f?.profilePicture
                  ? PF + f?.profilePicture
                  : PF + "defaultPP.png"
              }
              alt=""
              className="sideBarFriendImg"
            />
            <span className="sideBarFriendName">{f?.username}</span>
          </li>
        </Link>
      ))}
    </div>
  );
}
