const express = require('express')

const router = express.Router()

const User = require('../db')

router.get('/', async (req, res) => {
    try {
        const posts = await User.find()
        res
            .status(200)
            .json(posts)
    } catch (err) {
        res
            .status(500)
            .json({ message: "The posts information could not be retrieved." })
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const post = await User.findById(id)
        if(!post) {
            res
                .status(404)
                .json({ message: "The post with the specified ID does not exist." })
        } else {
            res
                .status(200)
                .json(post)
        }
    } catch (err) {
        res
            .status(500)
            .json({ message: "The post information could not be retrieved." })
    }
})

router.get('/:id/comments', async (req, res) => {
    const { id } = req.params

    try {
        const post = await User.findById(id)
        if(!post) {
            res
                .status(404)
                .json({ message: "The post with the specified ID does not exist." })
        } else {
            const comments = await User.findPostComments(id)
            res
                .status(200)
                .json(comments)
        }
    } catch (err) {
        res
            .status(500)
            .json({ message: "The post information could not be retrieved." })
    }
})

router.post('/', (req, res) => {
    if(!req.body.title || !req.body.contents) {
        res
            .status(400)
            .json({ message: "Please provide title and contents for the post." })
    }
    try {
        const post = req.body
        User.insert(post)
        res
            .status(201)
            .json(post)
    } catch (err) {
        res
            .status(500)
            .json({ message: "There was an error while saving the post to the database." })
    }
})

router.post('/:id/comments', async (req, res) => {
    const { id } = req.params

    if(!req.body.text) {
        res
            .status(400)
            .json({ message: "Please provide text for the comment." })
    }

    try {
        const post = await User.findById(id)
        if(!post) {
            res
                .status(404)
                .json({ message: "The post with the specified ID does not exist." })
        } else {
            const comment = req.body
            User.insertComment(comment)
            res
                .status(201)
                .json(comment)
        }
    } catch (err) {
        res
            .status(500)
            .json({ message: "There was an error while saving the comment to the database" })
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const post = await User.findById(id)
        if(!post) {
            res
                .status(404)
                .json({ message: "The post with the specified ID does not exist." })
        } else {
            User.remove(id)
            res
                .status(200)
                .json({ message: 'Post succesfully deleted.'})
        }
    } catch (err) {
        res
            .status(500)
            .json({ message: 'Post could not be deleted. '})
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params
    if(!req.body.title || !req.body.contents) {
        res
            .status(400)
            .json({ message: 'Title and Content required.'})
    }

    try {
        const newPost = req.body
        const post = await User.findById(id)
        if(!post) {
            res
                .status(404)
                .json({ message: 'Post with specified ID not found.'})
        } else {
            User.update(id, newPost)
            res
                .status(200)
                .json(newPost)
        }
    } catch (err) {
        res
            .status(500)
            .json({ message: 'Could not updated post. '})
    }
})
module.exports = router