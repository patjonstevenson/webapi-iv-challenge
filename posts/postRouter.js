const express = require('express');
const router = require("express").Router();
const postDb = require("./postDb");



router.get('/', async (req, res) => {
    try {
        const posts = await postDb.get();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});

router.get('/:id', validatePostId, async (req, res) => {
    const { id } = req.params;
    try {
        const posts = await postDb.getById(id);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});

router.delete('/:id', validatePostId, async (req, res) => {
    const { id } = req.params;
    const post = postDb.getById(id);
    try {
        const deleted = await postDb.remove(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});

router.put('/:id', validatePostId, async (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    try {
        const changed = await postDb.update(id, changes);
        res.status(201).json(changed);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});

// custom middleware

async function validatePostId(req, res, next) {
    const { id } = req.params;
    try {
        const post = await postDb.getById(id);
        if (!post) {
            res.status(404).json({ message: "Post with the given id not found." });
        } else {
            next();
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

module.exports = router;