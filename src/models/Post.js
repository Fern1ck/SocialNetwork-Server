const Mongoose = require("mongoose")
const ObjectID = require("mongodb").ObjectID

const postSchema = new Mongoose.Schema(
    {
        authorID: { type: ObjectID, required: true },
        textContent: { type: String, required: true },
        likesIDs: { type: Array, required: true, default: [] },
        commentsIDs: { type: Array, required: true, default: [] },
        postDate: { type: Date, required: true, default: Date.now },
    },
    { collection: "posts" }
)

module.exports = Mongoose.model("Post", postSchema)
