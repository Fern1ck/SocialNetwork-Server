const Messages = require("../../utils/Messages")

module.exports = (CommentModel, PostService, UserService) => {
    if (!CommentModel || !PostService) throw new Error("Parameters required")

    return {
        GetPostComments: async postID => {
            let post = await PostService.GetSinglePost(postID)

            return CommentModel.find({ postID: post._id })
                .then(comments => {
                    return comments
                })
                .catch(err => console.log(err))
        },

        GetSingleComment: commentID => {
            return CommentModel.findOne({ _id: commentID })
                .then(async comment => {
                    if (comment) {
                        comment._doc.author = await UserService.SimpleFetchByID(
                            comment._doc.authorID
                        )

                        delete comment._doc.authorID
                        return comment
                    } else {
                        throw new Error(Messages.Comment.DoesntExist)
                    }
                })
                .catch(err => console.log(err))
        },

        PostComment: async (authorID, postID, textContent) => {
            if (!textContent) {
                throw new Error(Messages.Comment.EmptyComment)
            }

            let post = await PostService.GetSinglePost(postID)

            const newComment = new CommentModel({
                authorID,
                postID: post._id,
                textContent: textContent,
            })

            const CommentDoc = await newComment.save()
            return CommentDoc
        },

        ToggleLike: async (userID, commentID) => {
            let User = await UserService.GetSingleUser(userID)

            let hasLiked = User.likesIDs.includes(User.id)

            if (!hasLiked) {
                Comment.likesIDs.push(User.id)
                User.likedPostsIDs.push(postID)

                await User.save()
                await Comment.save()
                return { Result: Messages.Post.LikedPost, Post: Comment }
            } else {
                Comment.likesIDs = Comment.likesIDs.filter(
                    likeID => likeID !== User.id
                )
                User.likedPostsIDs = User.likedPostsIDs.filter(
                    likedPostID => likedPostID !== postID
                )

                await User.save()
                await Comment.save()
                return { Result: Messages.Post.RemovedLike, Post: Comment }
            }
        },

        DeleteComment: async commentID => {
            return CommentModel.findOne({ _id: commentID })
                .then(async comment => {
                    if (comment) {
                        await comment.remove()
                        return Messages.Comment.DeletedComment
                    } else {
                        return Messages.Comment.DoesntExist
                    }
                })
                .catch(err => console.log(err))
        },
    }
}
