import "./message.css"
import {format} from "timeago.js"
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"


export default function Message({own, message, friend}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  const {user} = useContext(AuthContext)
  return (
    <div className={own ? "message own" : "message"}>
      <div className="msgTop">
        <img src={own ? user?.profilePicture ? PF+user.profilePicture : PF+"/defaultPP.png" : friend?.profilePicture ? PF+friend.profilePicture : PF + "/defaultPP.png"} alt="" className="msgImg" />
        <p className="msgText">{message.text}</p>
      </div>
      <div className="msgBottom">
        {format(message.createdAt)}
      </div>
    </div>
  )
}
