const Mongoose = require("mongoose")
const ObjectID = require("mongodb").ObjectID

const authSchema = new Mongoose.Schema(
    {
        userID: { type: ObjectID, required: true, unique: true },
        email: {type: String, required: true, unique: true},
        password: { type: String, required: true },
        salt: {type: String, required: true}
    },
    { collection: "auth" }
)

module.exports = Mongoose.model("Auth", authSchema)
