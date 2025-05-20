const express = require('express');
const BlogsController = require('../controllers/BlogsController')

const BlogsRouter = express.Router();


BlogsRouter.post(
    '/publish',
    (req, res) => {
        const result = new BlogsController().publish(req.body);
        result.then(
            (success) => {
                res.send(success);
            }
        ).catch(
            (error) => {
                res.send(error);
            }
        )
    }
)

BlogsRouter.post(
    '/save-draft',
    (req, res) => {
        const result = new BlogsController().saveDraft(req.body);
        result.then(
            (success) => {
                res.send(success);
            }
        ).catch(
            (error) => {
                res.send(error);
            }
        )
    }
)

BlogsRouter.get(
    '/',
    (req, res) => {
        const result = new BlogsController().allBlogs();
        result.then(
            (success) => {
                res.send(success);
            }
        ).catch(
            (error) => {
                res.send(error);
            }
        )
    }
)

BlogsRouter.get(
    '/:id',
    (req, res) => {
        const result = new BlogsController().blogsById(req);
        result.then(
            (success) => {
                res.send(success);
            }
        ).catch(
            (error) => {
                res.send(error);
            }
        )
    }
)

BlogsRouter.patch(
    '/update/:id',
    (req, res) => {
        const result = new BlogsController().update(req);
        result.then(
            (success) => {
                res.send(success);
            }
        ).catch(
            (error) => {
                res.send(error);
            }
        )
    }
)

BlogsRouter.delete(
    '/delete/:id',
    (req, res) => {
        const result = new BlogsController().delete(req);
        result.then(
            (success) => {
                res.send(success);
            }
        ).catch(
            (error) => {
                res.send(error);
            }
        )
    }
)

module.exports = BlogsRouter;