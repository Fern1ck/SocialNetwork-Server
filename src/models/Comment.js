const Mongoose = require("mongoose")
const ObjectID = require("mongodb").ObjectID

const commentSchema = new Mongoose.Schema(
    {
        postID: { type: ObjectID, required: true },
        authorID: { type: ObjectID, required: true },
        textContent: { type: String, required: true },
        likesCount: { type: Number, required: true, default: 0 },
    },
    { collection: "comment" }
)

module.exports = Mongoose.model("Comment", commentSchema)
