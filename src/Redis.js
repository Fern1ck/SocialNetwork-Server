const redis = require("redis")
const session = require("express-session")
const RedisStore = require("connect-redis")(session)

let RedisConnection

const ConnectToRedis = async (RedisHost, RedisPort, EXPRESS_SESSION_SECRET) => {
    if (RedisConnection) {
        return
    }
    RedisConnection = redis.createClient({ host: RedisHost, port: RedisPort })

    console.log("Connected to Redis and handling sessions")

    return session({
        secret: EXPRESS_SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        store: new RedisStore({ client: RedisConnection }),
    })
}

const DisconnectFromRedis = () => {
    if (!RedisConnection) {
        return
    }
    Mongoose.disconnect()
}

module.exports = {
    ConnectToRedis,
    DisconnectFromRedis,
}
