const config = require("./config")
const cors = require("cors")
const morgan = require("morgan")
const passport = require("passport")
const { ConnectToMongoDB } = require("./src/MongoDB")
const { ConnectToRedis } = require("./src/Redis")
const express = require("express")

//Routes
const userRouter = require("./src/routes/user")
const postRouter = require("./src/routes/post")
const accountRouter = require("./src/routes/account")
const followRouter = require("./src/routes/follow")
const errorHandler = require("./src/routes/errorHandler")
const { EXPRESS_SESSION_SECRET } = require("./config")

const StartServer = async () => {
    const app = express()
    app.use(cors())
    app.use(morgan("dev"))
    app.use(express.json())

    //Connect to MongoDB
    await ConnectToMongoDB(config.MONGOURI)

    //Connect to Redis
    let sessions = await ConnectToRedis(
        config.REDIS_HOST,
        config.REDIS_PORT,
        EXPRESS_SESSION_SECRET
    )

    app.use(sessions)

    require("./src/utils/Authentication/passportConfig") //defines the config for passport.js
    app.use(passport.initialize())
    app.use(passport.session())

    //Routes
    app.use(accountRouter)
    app.use("/follow", followRouter)
    app.use("/user", userRouter)
    app.use("/post", postRouter)

    //handle errors
    app.use(errorHandler)

    app.listen(config.EXPRESS_PORT, () => {
        console.log("Server listening on PORT: " + config.EXPRESS_PORT)
    })
}

StartServer()
