const CommentService = require("./CommentData")
const CommentModel = require("../../models/Comment")
const PostService = require("../post")
const UserService = require("../user")

module.exports = CommentService(CommentModel, PostService, UserService)
