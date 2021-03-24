const FollowService = require("../src/services/followSystem")
const { assert } = require("chai")
const UserModel = require("../src/models/User")
const { ConnectToMongoDB } = require("./../src/MongoDB")
const config = require("../config")
const Messages = require("../src/utils/Messages")

describe("FOLLOW SYSTEM SERVICE", function () {
    let user1
    const email1 = "test@gmail.com"
    const username1 = "test123"

    let user2
    const email2 = "test2@gmail.com"
    const username2 = "test1234"

    this.beforeAll(async () => {
        await ConnectToMongoDB(config.MONGOURI_TESTDB)
        await UserModel.deleteMany()
        user1 = await new UserModel({
            email: email1,
            username: username1,
        }).save()
        user2 = await new UserModel({
            email: email2,
            username: username2,
        }).save()
    })

    describe("ToggleFollow", function () {
        it("Starts following a user or unfollows it", async () => {
            try {
                //start following
                let Result = await FollowService.ToggleFollow(user1, username2)
                assert.equal(Result, Messages.Follow.StartedFollowing)
                user1 = await UserModel.findOne({ email: email1 })
                user2 = await UserModel.findOne({ email: email2 })
                assert.isTrue(user1.followingIDs.includes(user2._id))
                assert.isTrue(user2.followersIDs.includes(user1._id))

                //stop following
                Result = await FollowService.ToggleFollow(user1, username2)
                assert.equal(Result, Messages.Follow.Unfollowed)
                user1 = await UserModel.findOne({ email: email1 })
                user2 = await UserModel.findOne({ email: email2 })
                assert.isFalse(user1.followingIDs.includes(user2._id))
                assert.isFalse(user2.followersIDs.includes(user1._id))
            } catch (err) {
                assert.fail(err.message)
            }
        })

        it("Fails if the user tries to follow himself", async () => {
            try {
                await FollowService.ToggleFollow(user1, username1)
            } catch (err) {
                assert.equal(err.message, Messages.Follow.CantFollowYourself)
            }
        })

        it("Fails if the user tries to follow a user that doesn't exist", async () => {
            try {
                await FollowService.ToggleFollow(user1, "THIS_FAILS")
            } catch (err) {
                assert.equal(err.message, Messages.User.DoesntExist)
            }
        })
    })

    describe("GetFollowing", function () {
        it("Gets the usernames of those who a given user follows", async () => {
            //setup
            user1.followingIDs.push(user2._id)
            await user1.save()

            let following = await FollowService.GetFollowing(username1)
            assert.equal(following[0]._id.toString(), user2._id.toString())
            assert.equal(following[0].username, username2)

            //clean up
            user1.followingIDs = user1.followingIDs.filter(
                followingID => followingID.toString() !== user2.id
            )
            await user1.save()
        })

        it("Fails if the given user doesn't exist", async () => {
            try {
                await FollowService.GetFollowing("THIS_FAILS")
                assert.fails()
            } catch (err) {
                assert.equal(err.message, Messages.User.DoesntExist)
            }
        })
    })

    describe("GetFollowers", function () {
        it("Gets the usernames of those who follow a given user", async () => {
            //setup
            user1.followersIDs.push(user2._id)
            await user1.save()

            let followers = await FollowService.GetFollowers(username1)
            assert.equal(followers[0]._id.toString(), user2._id.toString())
            assert.equal(followers[0].username, username2)

            //clean up
            user1.followersIDs = user1.followersIDs.filter(
                followerID => followerID.toString() !== user2.id
            )
            await user1.save()
        })

        it("Fails if the given user doesn't exist", async () => {
            try {
                await FollowService.GetFollowers("THIS_FAILS")
                assert.fails()
            } catch (err) {
                assert.equal(err.message, Messages.User.DoesntExist)
            }
        })
    })

    this.afterAll(async () => {
        //drop the collections
        await UserModel.deleteMany()
    })
})
