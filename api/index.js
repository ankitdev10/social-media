const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const helmet = require("helmet")
const morgan = require("morgan")
const path = require("path")
const app = express()
// routes
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/post")
const conversationRoute = require("./routes/conversation")
const messageRoute = require("./routes/messages")
const multer = require("multer")

dotenv.config()

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => console.log("failed connection w database" + err));


app.use("/images", express.static(path.join(__dirname, "public/images")))
// middleware

app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

const storage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null, "public/images")
  },
  filename: (req,file,cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({storage});
app.post("/api/upload", upload.single("file"), async (req,res) => {
  try {
    return res.status(200).json("File uploaded successfully")
  } catch (error) {
    console.log(error);
  }
})

// implementing routes

app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/post", postRoute)
app.use("/api/conversations", conversationRoute)
app.use("/api/message", messageRoute)

app.get("/" ,(req,res) => {
    res.send("home page ")
})

app.listen(4000, () => {
    console.log("bakcend running");
})