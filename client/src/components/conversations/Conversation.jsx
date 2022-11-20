import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import "./convo.css";

export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);
    const getUser = async () => {
      try {
        const res = await axios.get("/users?userId=" + friendId);
        setUser(res.data)
      } catch (error) {console.log(error)}
    };
    getUser()
  }, [currentUser, conversation]);
  return (
    <div className="convo">
      <img
        src={user?.profilePicture ? PF+user.profilePicture : PF+"/defaultPP.png"}
        alt=""
        className="convoImg"
      />
      <span className="convoName">{user?.username}</span>
    </div>
  );
}
