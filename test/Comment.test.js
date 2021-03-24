const PostService = require("../src/services/post")
const CommentService = require("../src/services/comment")
const { assert } = require("chai")
const PostModel = require("../src/models/Post")
const UserModel = require("../src/models/User")
const CommentModel = require("../src/models/Comment")
const { ConnectToMongoDB } = require("../src/MongoDB")
const config = require("../config")
const Messages = require("../src/utils/Messages")
const { RANDOM_ID } = require("./testUtils")

describe("COMMENT SERVICE", function () {
    const email = "test@gmail.com"
    const username = "test123"
    const PostTextContent = "this is a post"
    let user, post

    this.beforeAll(async () => {
        await ConnectToMongoDB(config.MONGOURI_TESTDB)
        await UserModel.deleteMany()
        await PostModel.deleteMany()
        await CommentModel.deleteMany()

        user = await new UserModel({ email, username }).save()
        post = await new PostModel({
            authorID: user.id,
            textContent: PostTextContent,
        }).save()
    })

    describe("GetPostComments", function () {
        it("Gets the comments of a given post", async () => {
            try {
                //setup
                const CommentTextContent1 = "this is a comment"
                const CommentTextContent2 = "this is another comment"

                let comment1 = await new CommentModel({
                    authorID: user._id,
                    postID: post._id,
                    textContent: CommentTextContent1,
                }).save()

                let comment2 = await new CommentModel({
                    authorID: user.id,
                    postID: post._id,
                    textContent: CommentTextContent2,
                }).save()

                const comments = await CommentService.GetPostComments(post.id)
                assert.isArray(comments)
                assert.equal(comments[0].id, comment1.id)
                assert.equal(comments[1].id, comment2.id)

                //clean up
                CommentModel.deleteMany()
            } catch (err) {
                assert.fail(err.message)
            }
        })

        it("Fails if the post doesn't exist", async () => {
            try {
                await CommentService.GetPostComments(RANDOM_ID)
                assert.fail()
            } catch (err) {
                assert.equal(err.message, Messages.Post.DoesntExist)
            }
        })
    })

    describe("GetSingleComment", function () {
        it("Gets a single comment", async () => {
            try {
                let CommentDoc = await new CommentModel({
                    authorID: user._id,
                    postID: post._id,
                    textContent: "this is a comment",
                }).save()

                let comment = await CommentService.GetSingleComment(
                    CommentDoc._id
                )

                assert.isDefined(comment._doc.author)
                assert.isUndefined(comment.authorID)
                assert.equal(comment._id.toString(), CommentDoc._id.toString())
                assert.equal(comment.textContent, CommentDoc.textContent)

                //clean up
                CommentModel.deleteMany()
            } catch (err) {
                assert.fail(err.message)
            }
        })
        it("Fails if the comment doesn't exist", async () => {
            try {
                await CommentService.GetSingleComment(RANDOM_ID) //random id that doesn't belong to any comment
                assert.fail()
            } catch (err) {
                assert.equal(err.message, Messages.Comment.DoesntExist)
            }
        })
    })

    describe("PostComment", function () {
        it("Posts a comment", async () => {
            try {
                let comment = await CommentService.PostComment(
                    user._id,
                    post._id,
                    PostTextContent
                )

                let CommentDoc = await CommentModel.findOne({
                    _id: comment._id,
                })

                assert.equal(comment._id.toString(), CommentDoc._id.toString())
                assert.equal(
                    CommentDoc.authorID.toString(),
                    user._id.toString()
                )
                assert.equal(CommentDoc.textContent, PostTextContent)

                //clean up
                CommentModel.deleteMany()
            } catch (err) {
                assert.fail(err.message)
            }
        })

        it("Fails if the post doesn't exist", async () => {
            try {
                await CommentService.PostComment(
                    user._id,
                    RANDOM_ID,
                    PostTextContent
                )
                assert.fail()
            } catch (err) {
                assert.equal(err.message, Messages.Post.DoesntExist)
            }
        })

        it("Fails if the text content is empty", async () => {
            try {
                await CommentService.PostComment(
                    user._id,
                    post._id, //random id that doesn't belong to any post
                    ""
                )
                assert.fail()
            } catch (err) {
                assert.equal(err.message, Messages.Comment.EmptyComment)
            }
        })
    })

    describe("ToggleLike", function () {
        it.skip("Likes a comment or removes the like from it", async () => {})

        it("Fails if the comment doesn't exist", async () => {})
    })

    describe("DeleteComment", function () {
        it("Deletes a comment", async () => {
            try {
                let CommentDoc = await new CommentModel({
                    authorID: user._id,
                    postID: post._id,
                    textContent: "this is a comment",
                }).save()

                await CommentService.DeleteComment(CommentDoc._id)

                let DeletedCommentDoc = await CommentModel.findOne({
                    id: CommentDoc._id,
                })

                assert.isNull(DeletedCommentDoc)
            } catch (err) {
                assert.fail(err.message)
            }
        })

        it("Fails if the comment doesn't exist", async () => {
            try {
                //random id that doesn't belong to any comment
                await CommentService.DeleteComment(RANDOM_ID)
                assert.fail()
            } catch (err) {
                assert.equal(err.message, Messages.Comment.DoesntExist)
            }
        })

        it.skip("Fails if the user who's trying to delete the comment is not its author", async () => {
            assert.fail("Not implemented")
        })
    })

    this.afterAll(async () => {
        //drop the collections
        await UserModel.deleteMany()
        await CommentModel.deleteMany()
    })
})
