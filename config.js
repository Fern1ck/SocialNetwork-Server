require("dotenv").config() //adds to process.env everything in the .env file

module.exports = {
    MONGOURI: process.env.MONGOURI,
    MONGOURI_TESTDB: process.env.MONGOURI_TESTDB,
    EXPRESS_PORT: process.env.EXPRESS_PORT,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
}
