const PostService = require("./PostsData")
const PostModel = require("../../models/Post")
const UserService = require("../../services/User")

module.exports = PostService(PostModel, UserService)
