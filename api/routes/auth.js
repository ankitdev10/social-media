const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    // generate hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    
    //create new user
    const { username, email, profilePicture, coverPicture } = req.body;
    const newUser = new User({
      username,
      email,
      password: hashedPass,
      profilePicture,
      coverPicture,
    });
   
    //save user
    const user = await newUser.save();
    res.status(200).json(user);
  
} catch (error) {
    console.log(error);
  }
});

// LOGIN

router.post("/login" , async (req,res) => {
    try {
        // check if user's email exists in database
        const user = await User.findOne({email: req.body.email})
        !user && res.status(404).send("User not found")
        //check password
        const checkPass = await bcrypt.compare(req.body.password, user.password)
        !checkPass && res.status(400).json("Wrong password")

        // authorize
        res.status(200).json(user)
    
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;
