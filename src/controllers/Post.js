const PostService = require("../services/post")
const { PostSchemas } = require("../utils/Validation/Schemas")

module.exports.PublishPost = async (req, res, handleError) => {
    try {
        console.log(req.user)
        const Validated = await PostSchemas.PublishPost.validateAsync(req.body)
        let Result = await PostService.CreatePost(req.user, Validated.textContent)
        return res.status(201).json({
            post: Result,
        })
    } catch (err) {
        handleError(err)
    }
}

module.exports.GetUserPosts = async (req, res, handleError) => {
    try {
        let Validated = await PostSchemas.GetUserPosts.validateAsync(req.query)
        let Result = await PostService.GetUserPosts(Validated.username)
        return res.status(200).json(Result)
    } catch (err) {
        handleError(err)
    }
}

module.exports.GetSinglePost = async (req, res, handleError) => {
    try {
        const Validated = await PostSchemas.GetSinglePost.validateAsync(
            req.params
            )
            let Result = await PostService.GetSinglePost(Validated.postID)
            return res.status(200).json({
                post: Result,
            })
        } catch (err) {
            handleError(err)
        }
    }
    
module.exports.ToggleLike =  async (req, res, handleError) => {
    try {
        const Validated = await PostSchemas.PostLikes.validateAsync(req.params)
        
        let {Result, Post} = await PostService.ToggleLike(Validated.postID, req.user)
        return res.status(200).json({
            message: Result,
            post : Post
        })
    } catch (err) {
        handleError(err)
    }
}

module.exports.DeletePost = async (req, res, handleError) => {
    try {
        const Validated = await PostSchemas.DeletePost.validateAsync(req.params)
        let Result = await PostService.DeletePost(req.user, Validated.postID)
        return res.status(200).json({
            message: Result,
        })
    } catch (err) {
        handleError(err)
    }
}