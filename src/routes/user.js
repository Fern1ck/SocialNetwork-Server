const express = require('express')
const {GetUsers, GetUserByUsername, UpdateUser} = require("../controllers/User")

const { isAuth } = require('../utils/Authentication/authMiddleware')

const userRouter = express.Router({
    strict:true
})

userRouter.get("/", GetUsers)
userRouter.post("/:username", GetUserByUsername)
userRouter.put("/", isAuth, UpdateUser)

module.exports = userRouter