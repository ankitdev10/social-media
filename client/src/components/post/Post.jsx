import "./post.css";
import { Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Post({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [deleteDiv, setDeleteDiv] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);
  console.log(PF);
  const handleDelete = async (e) => {
    console.log(post);
    e.preventDefault();
    try {
      await axios.delete("/post/" + post._id, {
        data: { userId: currentUser._id },
      });
      window.location.reload();
      console.log(post);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  const likeHandler = async () => {
    try {
      axios.put("/post/" + post._id + "/like", { userId: currentUser._id });
    } catch (error) {
      console.log(error);
    }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link
              to={`/profile/${user?.username}`}
              style={{ textDecoration: "none" }}
            >
              <img
                src={user?.profilePicture || "defaultPP.png"}
                className="postProfileImg"
                alt=""
              />
            </Link>
            <span className="postUsername">{user?.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <div className="postTopRightWrapper">
              <Delete
                // style={{ display: deleteDiv ? "none" : "block" }}
                onClick={() => setDeleteDiv(!deleteDiv)}
                className="deletePost"
                style={{
                  display:
                    post.userId !== currentUser._id || deleteDiv
                      ? "none"
                      : "block",
                }}
              />
              {deleteDiv && (
                <div className="deleteConfirmBox">
                  <div className="deleteConfirmBoxWrapper">
                    <span className="deleteConfirmBoxText">Confirm delete</span>
                    <div className="deleteButtons">
                      <button onClick={handleDelete} className="confirmDelete">
                        Delete
                      </button>
                      <button
                        onClick={() => setDeleteDiv(false)}
                        className="cancelDelete"
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img src={PF + post.img} alt="" className="postImg" />
        </div>

        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              onClick={likeHandler}
              className="likeIcon"
              src={`${PF}like.png`}
              alt=""
            />
            <img
              onClick={likeHandler}
              className="likeIcon"
              src={`${PF}heart.png`}
              alt=""
            />
            <span className="likeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
