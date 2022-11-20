const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// UPDATE USER
router.put("/:id", async (req, res) => {
  // User authorised or not
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    //if password is updated hash it again
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can only update your account");
  }
});
// DELETE USER
router.delete("/:id", async (req, res) => {
  // User authorised or not
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("deleted accouunt");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can only delete your account");
  }
});

// GET A USER
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get friends

router.get("/friends/:userId", async (req, res) => {
  
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(user.following.map((friendId) => {
      return  User.findById(friendId)
    }));
    let friendList = []; 
    friends.map(friend => {
      const {_id, username, profilePicture} = friend
      friendList.push({_id, username, profilePicture})
    })
    res.status(200).json(friendList)
  } catch (error) {
    res.status(500).json(error);
  }
});
// FOLLOW A USER

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { following: req.params.id } });
        res.status(200).json("User has been followed");
      } else {
        res.status(403).json("You already follow this account");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("you can not follow yourself");
  }
});
//UNFOLLOW A USER
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });

        res.status(200).json("User has been unfollowed");
      } else {
        res.status(403).json("You dont follow this account");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("you can not unfollow yourself");
  }
});

module.exports = router;
