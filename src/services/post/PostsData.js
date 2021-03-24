const Messages = require("../../utils/Messages")

module.exports = (PostModel, UserService) => {
    if (!PostModel || !UserService) throw new Error("Parameters required")

    const GetSinglePost = postid => {
        return PostModel.findOne({ _id: postid })
            .then(post => {
                if (!post) throw new Error(Messages.Post.DoesntExist)

                return post
            })
            .catch(err => {
                throw new Error(err.message)
            })
    }

    return {
        CreatePost: async (User, textContent) => {
            const newPost = new PostModel({
                authorID: User.id,
                textContent: textContent,
            })

            const PostDoc = await newPost.save()
            User.publishedPostsIDs.push(PostDoc.id)
            await User.save()
            return PostDoc
        },

        GetUserPosts: async username => {
            let user = await UserService.GetUserByUsername(username)
            return PostModel.find({ authorID: user.id })
                .then(Posts => {
                    return Posts
                })
                .catch(err => {
                    throw new Error(err.message)
                })
        },

        GetSinglePost: GetSinglePost,

        ToggleLike: async (postID, User) => {
            let Post = await GetSinglePost(postID)

            let hasLiked = Post.likesIDs.includes(User.id)

            if (!hasLiked) {
                Post.likesIDs.push(User.id)
                User.likedPostsIDs.push(postID)

                await User.save()
                await Post.save()
                return { Result: Messages.Post.LikedPost, Post }
            } else {
                Post.likesIDs = Post.likesIDs.filter(
                    likeID => likeID !== User.id
                )
                User.likedPostsIDs = User.likedPostsIDs.filter(
                    likedPostID => likedPostID !== postID
                )

                await User.save()
                await Post.save()
                return { Result: Messages.Post.RemovedLike, Post }
            }
        },

        DeletePost: async (User, postID) => {
            await UserService.SimpleFetchByID(User.id) //check if exists
            const Post = await GetSinglePost(postID)

            if (User.id.toString() !== Post.authorID.toString()) {
                throw new Error(Messages.Post.PostNotYours)
            }

            if (User.publishedPostsIDs.includes(Post.id)) {
                return PostModel.deleteOne({ _id: postID })
                    .then(async () => {
                        User.publishedPostsIDs = User.publishedPostsIDs.filter(
                            publishedPostID => publishedPostID !== postID
                        )
                        await User.save()

                        return Messages.Post.DeletedPost
                    })
                    .catch(err => {
                        throw new Error("There's been an error: " + err)
                    })
            } else {
                throw new Error(Messages.Post.PostNotYours)
            }
        },
    }
}
