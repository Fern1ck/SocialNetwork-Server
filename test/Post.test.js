const PostService = require("../src/services/post")
const { assert } = require("chai")
const UserModel = require("../src/models/User")
const { ConnectToMongoDB } = require("./..//src/MongoDB")
const config = require("../config")
const PostModel = require("../src/models/Post")
const Messages = require("../src/utils/Messages")
const { RANDOM_ID } = require("./testUtils")

describe("POST SERVICE", function () {
    const email1 = "test@gmail.com"
    const email2 = "test2@gmail.com"
    const username1 = "test123"
    const username2 = "test1234"
    const textContent1 = "this is a post"
    const textContent2 = "this is another post"
    let user

    this.beforeAll(async () => {
        await ConnectToMongoDB(config.MONGOURI_TESTDB)
        await UserModel.deleteMany()
        await PostModel.deleteMany()
        user = await new UserModel({
            email: email1,
            username: username1,
        }).save()
    })

    describe("CreatePost", function () {
        it("Creates a post", async () => {
            try {
                let post = await PostService.CreatePost(user, textContent1)
                user = await UserModel.findOne({ email: email1 })
                assert.equal(user.publishedPostsIDs, post.id)
                assert.equal(post.textContent, textContent1)
                assert.equal(post.authorID, user.id)

                //clean up
                user.publishedPostsIDs = user.publishedPostsIDs.filter(
                    publishedPostID => publishedPostID !== post.id
                )
                await user.save()
                await PostModel.deleteOne({ _id: post.id })
            } catch (err) {
                assert.fail(err.message)
            }
        })
    })

    describe("GetUserPosts", function () {
        it("Gets all the posts from a given user", async () => {
            try {
                //setup
                let post1 = new PostModel({
                    authorID: user.id,
                    textContent: textContent1,
                })
                let post2 = new PostModel({
                    authorID: user.id,
                    textContent: textContent2,
                })
                await post1.save()
                await post2.save()
                user.publishedPostsIDs.push(post1.id)
                user.publishedPostsIDs.push(post2.id)
                await user.save()

                //test
                let posts = await PostService.GetUserPosts(username1)
                assert.isArray(posts)
                assert.equal(posts[0].id, post1.id)
                assert.equal(posts[0].textContent, textContent1)
                assert.equal(posts[1].id, post2.id)
                assert.equal(posts[1].textContent, post2.textContent)

                //clean up
                await PostModel.deleteMany()
            } catch (err) {
                assert.fail(err.message)
            }
        })

        it("Fails if the user doesn't exist", async () => {
            try {
                await PostService.GetUserPosts("THIS_FAILS")
                assert.fail()
            } catch (err) {
                assert.equal(err.message, Messages.User.DoesntExist)
            }
        })
    })

    describe("GetSinglePost", function () {
        it("Gets a single post", async () => {
            try {
                //setup
                let post = new PostModel({
                    authorID: user.id,
                    textContent: textContent1,
                })
                await post.save()
                user.publishedPostsIDs.push(post.id)
                await user.save()

                //test
                let doc = await PostService.GetSinglePost(post.id)
                assert.equal(doc._id.toString(), post._id.toString())
                assert.equal(doc.textContent, textContent1)
                assert.equal(doc.authorID, user.id)

                //cleanup
                await PostModel.deleteMany()
            } catch (err) {
                assert.fail(err.message)
            }
        })

        it("Fails if the post doesn't exist", async () => {
            try {
                await PostService.GetSinglePost(RANDOM_ID)
                assert.fail()
            } catch (err) {
                assert.equal(err.message, Messages.Post.DoesntExist)
            }
        })
    })

    describe("ToggleLike", function () {
        it("Likes a post or removes the like from it", async () => {
            let post = await new PostModel({
                authorID: user.id,
                textContent: textContent1,
            }).save()
            assert.isEmpty(post.likesIDs)

            await PostService.ToggleLike(post.id, user)
            post = await PostModel.findOne({ _id: post.id })
            assert.include(post.likesIDs, user.id)

            await PostService.ToggleLike(post.id, user)
            post = await PostModel.findOne({ _id: post.id })
            assert.notInclude(post.likesIDs, user.id)

            //clean up
            PostModel.deleteMany()
        })

        it("Fails if the post don't exist", async () => {
            try {
                await PostService.ToggleLike(RANDOM_ID, user)
                assert.fail()
            } catch (err) {
                assert.equal(err.message, Messages.Post.DoesntExist)
            }
        })
    })

    describe("DeletePost", function () {
        it("Deletes a post", async () => {
            try {
                //setup
                let post = await new PostModel({
                    authorID: user.id,
                    textContent: textContent1,
                }).save()

                user.publishedPostsIDs.push(post._id.toString())
                await user.save()
                await PostService.DeletePost(user, post._id)

                let PostDoc = await PostModel.findOne({ _id: post._id })
                assert.isNull(PostDoc)
            } catch (err) {
                assert.fail(err.message)
            }
        })

        it("Fails if the post doesn't exist", async () => {
            try {
                await PostService.DeletePost(user, RANDOM_ID)
                assert.fail()
            } catch (err) {
                assert.equal(err.message, Messages.Post.DoesntExist)
            }
        })

        it("Fails if the user who's trying to delete the post doesn't exist", async () => {
            try {
                //setup
                let post = await new PostModel({
                    authorID: user.id,
                    textContent: textContent1,
                }).save()

                await PostService.DeletePost(RANDOM_ID, post._id)
                assert.fail()
            } catch (err) {
                assert.equal(err.message, Messages.User.DoesntExist)
            }
        })
        it("Fails if the user who's trying to delete the post is not its author", async () => {
            try {
                //setup
                let post = await new PostModel({
                    authorID: user.id,
                    textContent: textContent1,
                }).save()

                let user2 = await new UserModel({
                    email: email2,
                    username: username2,
                }).save()

                await PostService.DeletePost(user2, post._id) //random id that doesn't belong to any post
                assert.fail()
            } catch (err) {
                assert.equal(err.message, Messages.Post.PostNotYours)
            }
        })
    })

    this.afterAll(async () => {
        //drop the collections
        await UserModel.deleteMany()
        await PostModel.deleteMany()
    })
})
