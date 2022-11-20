import "./rightbar.css";
import { useContext, useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@mui/icons-material";
import Messenger from "../../pages/messenger/Messenger";

export default function Rightbar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);

  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(
    currentUser.following.includes(user?._id)
  );

  const getConvo = async () => {
    // if convo exists fetch it else post a new one
    try {
      const res = await axios.get(
        `/conversations/find/${user._id}/${currentUser._id}`
      );
      if(!res.data?.members.includes(user._id)){
        axios.post("/conversations", {
          senderId: currentUser._id,
          receiverId: user._id
        })
      }
      window.location.replace("/messenger");
    } catch (error) {
      console.log(error);
    }
  };

  // TODO: CREATE USE STATE TO STORE ABOVE CONVO AND USE ITS ID TO FETCH CONVO BETWEEN THOSE USERS. USE Messenger COMPONENT IF DATA AVAILABLE

  useEffect(() => {
    setFollowed(currentUser.following.includes(user?._id));
  }, [currentUser, user]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get("/users/friends/" + user._id);
        setFriends(friendList?.data);
      } catch (error) {
        console.log(error);
      }
    };
    getFriends();
  }, [user]);

  const handleClick = async (e) => {
    try {
      if (followed) {
        console.log("triggered unfollow route");
        await axios.put("/users/" + user._id + "/unfollow", {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        console.log("triggered follow route");

        await axios.put("/users/" + user._id + "/follow", {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
    } catch (error) {
      console.log(error);
    }
  };
  const HomeRightBar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img src="/assets/gift.png" alt="" className="birthdayImg" />
          <span className="birthdayText">
            <b>Ankit </b> and <b>3 other friends</b> have birthday today
          </span>
        </div>
        <img src="/assets/ad.png" alt="" className="rightbarAd" />
      </>
    );
  };

  const ProfileRightBar = () => {
    return (
      <>
        {user.username !== currentUser.username && (
          <div className="rightbarLinkBtn">
            <button className="rightbarFollowBtn" onClick={handleClick}>
              {followed ? "Unfollow" : "Follow"}{" "}
              {followed ? (
                <Remove className="rightbarFollowIcon" />
              ) : (
                <Add className="rightbarFollowIcon" />
              )}{" "}
            </button>
            <button onClick={getConvo} className="rightbarMsgBtn">
              Message
            </button>
          </div>
        )}
        <h4 className="rightbarTitle">User Information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City: </span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From: </span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship: </span>
            <span className="rightbarInfoValue">
              {user.relationship === 1
                ? "Single"
                : user.relationship === 2
                ? "Married"
                : "Unknown"}
            </span>
          </div>
        </div>
        <h4 className="rightbarTitle">User Friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => {
            return (
              <>
                <Link
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    textAlign: "center",
                  }}
                  to={`/profile/${friend.username}`}
                >
                  <div className="rightbarFollowing">
                    <img
                      src={
                        friend.profilePicture
                          ? PF + friend.profilePicure
                          : PF + "/defaultPP.png"
                      }
                      alt=""
                      className="rightbarFollowingImg"
                    />
                    <span
                      style={{ marginTop: 10 + "px" }}
                      className="rightbarFollowingName"
                    >
                      {friend.username}
                    </span>
                  </div>
                </Link>
              </>
            );
          })}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightBar /> : <HomeRightBar />}
      </div>
    </div>
  );
}
