const express = require("express")
const { GetFollow, ToggleFollow } = require("../controllers/follow")

const { isAuth } = require("../utils/Authentication/authMiddleware")

const followRouter = express.Router({
    strict: true,
})

followRouter.get("/:username", isAuth, GetFollow)
followRouter.post("/", isAuth, ToggleFollow)

module.exports = followRouter
