// Every route in this file already starts with '/posts'
const express = require('express');
const Post = require('../models/Post');
const router = express.Router();
const oAuth = require("../middleware/oauth");
const jwtCheck = require("../middleware/jwtCheck")


// router.post('/', oAuth, async (req, res) => {
//     try {
//     const { access_token } = req.oauth;
//     const data = {
//       "title": "sample",
//       "description": "test",
//       "username": "me",
//       "user_id": 12345,
//       "lastUpdated": "4:34PM"
//     }
//     const response = await axios({
//       method: "post",
//       url: 'http://localhost:3001/posts/validated',
//       headers: { Authorization: `Bearer ${access_token}` },
//       data: data
//     });
//     res.json(response.data);
//   } catch (error) {
//     console.log(error);
//     if (error.response.status === 401) {
//       res.status(401).json("Unauthorized to access data");
//     } else if (error.response.status === 403) {
//       res.status(403).json("Permission denied");
//     } else {
//       res.status(500).json("Whoops, something went wrong");
//     }
//   }
// });



// Get every post
router.get('/',  async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    }
    catch(error) {
        res.json({ message: error });
    }
});

// Get a specific post
router.get('/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        res.json(post);
    }
    catch(error) {
        res.json({ message: error });
    }
});

// Create a post
router.post('/', jwtCheck, async (req, res) => {
    // console.log("request:",req)
    const newPost = new Post({
        title: req.body.title,
        description: req.body.description,
        username: req.body.username,
        user_id: req.body.user_id,
        lastUpdated: req.body.lastUpdated
    });
    try {
        const savedPost = await newPost.save();
        res.json(savedPost);
    }catch(error) {
        res.json({ message: error });
    }
});

// Delete a post
router.delete('/:postId', jwtCheck, async (req, res) => {
    try {
        const removedPost = await Post.deleteMany({ _id: req.params.postId })
        res.json(removedPost)
    }
    catch(error) {
        res.json({ message: error });
    }
});

// Update a post
router.patch('/:postId', jwtCheck, async (req, res) => {
    try {
        const updatedPost = await Post.updateOne(
            { _id: req.params.postId },
            { $set: {
                title: req.body.title, 
                description: req.body.description, 
                username: req.body.username,
                user_id: req.body.user_id,
                lastUpdated: req.body.lastUpdated
                }}
        );
        res.json(updatedPost)
    }
    catch(error) {
        res.json({ message: error });
    }
});

module.exports = router;