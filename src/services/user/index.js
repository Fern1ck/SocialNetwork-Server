const UserModel = require("../../models/User")
const UserService = require("./UsersData")

module.exports = UserService(UserModel)