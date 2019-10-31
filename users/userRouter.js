const express = 'express';

const router = require("express").Router();

const userDb = require("./userDb");
const postDb = require("../posts/postDb");

router.post('/', validateUser, async (req, res) => {
    const body = req.body;
    try {
        const user = await userDb.insert(body);
        res.status(201).json({ user });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
    const body = req.body;
    const { id } = req.params;
    const post = {
        ...body,
        user_id: id
    }
    try {
        const newPost = await postDb.insert(post);
        res.status(201).json(newPost);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await userDb.get();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});

router.get('/:id', validateUserId, async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userDb.getById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});

router.get('/:id/posts', validateUserId, async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userDb.getUserPosts(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});

router.delete('/:id', validateUserId, async (req, res) => {
    const { id } = req.params;
    const user = await userDb.getById(id);
    try {
        const deleted = await userDb.remove(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});

router.put('/:id', validateUserId, async (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    try {
        const updated = await userDb.update(id, changes);
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});

//custom middleware

async function validateUserId(req, res, next) {
    const { id } = req.params;
    try {
        const user = await userDb.getById(id);
        if (!user) {
            res.status(400).json({ message: "invalid user id" });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error })
    }
};

function validateUser(req, res, next) {
    const { body } = req;
    console.log("\n\nvalidateUser, request body: ", body);
    if (!body) {
        res.status(400).json({ message: "missing user data" });
    }
    if (!body.name) {
        res.status(400).json({ message: "missing required name field" });
    }
    next();
};

function validatePost(req, res, next) {
    const { body } = req;
    if (!body) {
        res.status(400).json({ message: "missing post data" });
    }
    if (!body.text) {
        res.status(400).json({ message: "missing required text field" });
    }
    next();
};

module.exports = router;
