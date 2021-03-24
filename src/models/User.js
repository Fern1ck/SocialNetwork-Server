const Mongoose = require("mongoose")

const userSchema = new Mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        bio: { type: String, defauLt: "" },
        followingIDs: { type: Array, required: true, default: [] },
        followersIDs: { type: Array, required: true, default: [] },
        likedPostsIDs: { type: Array, required: true, default: [] },
        likedCommentsIDs : { type: Array, required: true, default: [] },
        publishedPostsIDs: { type: Array, required: true, default: [] },
        registeredTimestamp: { type: Date, required: true, default: Date.now },
    },
    { collection: "users" }
)

module.exports = Mongoose.model("User", userSchema)