import "./sidebar.css";
import {RssFeed,Event, School, ChatBubble, VideoCall, WorkOutline, People, Bookmarks, HelpCenter} from "@mui/icons-material" 
import CloseFriend from "../closefriend/CloseFriend";
import { useContext } from "react";
import {AuthContext} from "../../context/AuthContext"
export default function Sidebar() {
  const {user} = useContext(AuthContext)
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sideBarList">
          <li className="sideBarListItem"><RssFeed className = "sidebarIcon"/>
          <span className="sideBarListItemtext">
          Feed
          </span>
          </li>
          <li className="sideBarListItem"><ChatBubble className = "sidebarIcon"/>
          <span className="sideBarListItemtext">
          Chats
          </span>
          </li>
          <li className="sideBarListItem"><VideoCall className = "sidebarIcon"/>
          <span className="sideBarListItemtext">
          Videos
          </span>
          </li>
          <li className="sideBarListItem"><People className = "sidebarIcon"/>
          <span className="sideBarListItemtext">
          Groups
          </span>
          </li>
          <li className="sideBarListItem"><Bookmarks className = "sidebarIcon"/>
          <span className="sideBarListItemtext">
          Bookmarks
          </span>
          </li>
          <li className="sideBarListItem"><HelpCenter className = "sidebarIcon"/>
          <span className="sideBarListItemtext">
          Questions
          </span>
          </li>
          <li className="sideBarListItem"><WorkOutline className = "sidebarIcon"/>
          <span className="sideBarListItemtext">
          Jobs
          </span>
          </li>
          <li className="sideBarListItem"><Event className = "sidebarIcon"/>
          <span className="sideBarListItemtext">
          Events
          </span>
          </li>
          <li className="sideBarListItem"><School className = "sidebarIcon"/>
          <span className="sideBarListItemtext">
          Courses
          </span>
          </li>
        </ul>
        <button className="sideBarbtn">
          Show More
        </button>
        <hr className="sidebarHr" />
        <ul className="sideBarFriendList">
        <CloseFriend user = {user} />
        </ul>
      </div>
    </div>
  );
}
