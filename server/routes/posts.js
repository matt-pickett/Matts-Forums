// Every route in this file already starts with '/posts'
const express = require('express');
const Post = require('../models/Post');
const router = express.Router();
const oAuth = require("../middleware/oauth");
const jwtCheck = require("../middleware/jwtCheck")
const CryptoJS = require('crypto-js');

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
    // Encrypt user_id using AES encryption
    const encryptionKey = process.env.ENCRYPTION_KEY;
    const encryptedUserId = CryptoJS.AES.encrypt(JSON.stringify(req.body.user_id), encryptionKey).toString();

    const newPost = new Post({
        title: req.body.title,
        description: req.body.description,
        username: req.body.username,
        user_id: encryptedUserId,
        lastUpdated: req.body.lastUpdated
    });

    try {
        const savedPost = await newPost.save();
        res.json(savedPost);
    } catch(error) {
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
    const encryptionKey = process.env.ENCRYPTION_KEY;
    const encryptedUserId = CryptoJS.AES.encrypt(JSON.stringify(req.body.user_id), encryptionKey).toString();
    try {
        const updatedPost = await Post.updateOne(
            { _id: req.params.postId },
            { $set: {
                title: req.body.title, 
                description: req.body.description, 
                username: req.body.username,
                user_id: encryptedUserId,
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