import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useRef } from "react";
import { io } from "socket.io-client";

export default function Messenger() {
  const [conversations, setConversations] = useState([]); //fetch user's all conversation, the side bar part
  const [currentChat, setCurrentChat] = useState(null); // middle part, fetch user's chat with that particular friend
  const [messages, setMessages] = useState([]); // get existing messages
  const [newMessage, setNewMessage] = useState(""); // create new message
  const [arrivalMessage, setArrivalMessage] = useState(null); // keeping track of message to update it real time
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [friend, setFriend] = useState(null); // friend to whom we are chatting
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();
  const socket = useRef();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  //getting friend name

  useEffect(() => {
    const getFriend = async () => {
      let friendId = currentChat.members.filter(
        (friend) => friend !== user._id
      );
      const res = await axios.get("/users?userId=" + friendId);
      setFriend(res.data);
    };

    getFriend();
  }, [currentChat]);

  //fetching user's conversation with other people, the left part
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversations/" + user._id);
        setConversations(
          res.data.sort((c1, c2) => {
            return new Date(c2.updatedAt) - new Date(c1.updatedAt);
          })
        );
      } catch (error) {
        console.log(error);
      }
    };
    getConversations();
  }, [user]);

  //fetching users all messages
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("/message/" + currentChat?._id);
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [currentChat]);

  //scroll effect

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  //implementing socket

  useEffect(() => {
    socket.current = io("ws://localhost:5000");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    socket.current?.emit("addUser", user._id);
    socket.current?.on("getUsers", (users) => {
      setOnlineUsers(
        user.following.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [user]);

  // post message
  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });
    try {
      const res = await axios.post("/message", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  // send msg with keypress

  const handleKeypress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };
  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              type="text"
              placeholder="Search for friends"
              className="chatMenuInput"
            />
            {conversations.map((c, index) => (
              <div key={index} onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={user} />
              </div>
            ))}
          </div>
        </div>

        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m, index) => (
                    <div ref={scrollRef}>
                      <Message
                        key={index}
                        message={m}
                        own={m.sender === user._id ? true : false}
                        friend = {friend}
                      />
                    </div>
                  ))}
                </div>

                <div className="chatBoxBottom">
                  <form className="messengerForm" onSubmit={handleSubmit}>
                    <input
                      className="chatMsgInput"
                      placeholder="Write message..."
                      onChange={(e) => setNewMessage(e.target.value)}
                      value={newMessage}
                    ></input>
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className="chatSubmitBtn"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <span className="nullConvo">
                Open a conversation to start a chat
              </span>
            )}
          </div>
        </div>

        <div className="chatOnline">
          <div className="chatonlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
            />
          </div> 
           
        </div>
      </div>
    </>
  );
}
