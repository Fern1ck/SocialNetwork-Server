const express = require("express")
const {PublishPost, GetUserPosts, GetSinglePost, ToggleLike, DeletePost} = require("../controllers/Post")

const {isAuth} = require("../utils/Authentication/authMiddleware")

const postRouter = express.Router({
    strict: true
})

postRouter.post("/", isAuth, PublishPost)
postRouter.get("/", GetUserPosts)
postRouter.get("/:postID", GetSinglePost)
postRouter.put("/:postID", isAuth, ToggleLike)
postRouter.delete("/:postID", isAuth, DeletePost)

module.exports = postRouter