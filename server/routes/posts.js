// Every route in this file already starts with '/posts'
const express = require('express');
const Post = require('../models/Post');
const router = express.Router();

// Get every post
router.get('/', async (req, res) => {
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
router.post('/', async (req, res) => {
    const newPost = new Post({
        title: req.body.title,
        description: req.body.description
    });
    try {
        const savedPost = await newPost.save();
        res.json(savedPost);
    }catch(error) {
        res.json({ message: error });
    }
});

// Delete a post
router.delete('/:postId', async (req, res) => {
    try {
        const removedPost = await Post.remove({ _id: req.params.postId })
        res.json(removedPost)
    }
    catch(error) {
        res.json({ message: error });
    }
});

// Update a post
router.patch('/:postId', async (req, res) => {
    try {
        const updatedPost = await Post.updateOne(
            { _id: req.params.postId },
            { $set: {title: req.body.title} }
        );
        res.json(updatedPost)
    }
    catch(error) {
        res.json({ message: error });
    }
});

module.exports = router;