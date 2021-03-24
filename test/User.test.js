const UserService = require("../src/services/user")
const { assert } = require("chai")
const UserModel = require("../src/models/User")
const { ConnectToDB } = require("./../src/MongoDB")
const config = require("../config")
const Messages = require("../src/utils/Messages")
const { RANDOM_ID } = require("./testUtils")

describe("USER SERVICE", function () {
    let user1
    const email1 = "test@gmail.com"
    const username1 = "test123"

    let user2
    const email2 = "test2@gmail.com"
    const username2 = "test1234"

    this.beforeAll(async () => {
        await ConnectToDB(config.MONGOURI_TESTDB)
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

    describe("GetUsers", () => {
        it("Gets the users", async () => {
            try {
                const Users = await UserService.GetUsers()
                assert.isArray(Users)
                assert.equal(Users[0].username, username1)
                assert.equal(Users[0].email, email1)
                assert.equal(Users[1].username, username2)
                assert.equal(Users[1].email, email2)
            } catch (err) {
                assert.fail(err.message)
            }
        })
    })

    describe("SimpleFetchByID", () => {
        it("Only gets the username by a userID", async () => {
            try {
                let FetchedUser1 = await UserService.SimpleFetchByID(user1._id)
                assert.isDefined(FetchedUser1._id)
                assert.isDefined(FetchedUser1.username)
                assert.equal(FetchedUser1.username, user1.username)
                assert.isUndefined(FetchedUser1.bio)

                let FetchedUser2 = await UserService.SimpleFetchByID(user2._id)
                assert.isDefined(FetchedUser2._id)
                assert.isDefined(FetchedUser2.username)
                assert.equal(FetchedUser2.username, user2.username)
                assert.isUndefined(FetchedUser2.bio)
            } catch (err) {
                assert.fail(err.message)
            }
        })

        it("Fails if the ID doesn't belong to any user", async () => {
            try {
                await UserService.SimpleFetchByID(RANDOM_ID) //random id that doesn't belong to any user
                assert.fail()
            } catch (err) {
                assert.equal(err.message, Messages.User.DoesntExist)
            }
        })
    })

    describe("GetUserByUsername", function () {
        it("Gets a user by its username", async () => {
            try {
                let FetchedUser1 = await UserService.GetUserByUsername(
                    username1
                )
                assert.equal(FetchedUser1._id.toString(), user1._id.toString())

                let FetchedUser2 = await UserService.GetUserByUsername(
                    username2
                )
                assert.equal(FetchedUser2._id.toString(), user2._id.toString())
            } catch (err) {
                assert.fail(err.message)
            }
        })

        it("Fails if the username doesn't exist", async () => {
            try {
                await UserService.GetUserByUsername("THIS_FAILS")
                assert.fail()
            } catch (err) {
                assert.equal(err.message, Messages.User.DoesntExist)
            }
        })
    })

    describe("GetUserByEmail", function () {
        it("Gets a user by its email", async () => {
            try {
                let FetchedUser1 = await UserService.GetUserByEmail(email1)
                assert.equal(FetchedUser1._id.toString(), user1._id.toString())

                let FetchedUser2 = await UserService.GetUserByEmail(email2)
                assert.equal(FetchedUser2._id.toString(), user2._id.toString())
            } catch (err) {
                assert.fail(err.message)
            }
        })

        it("Fails if the email doesn't exist", async () => {
            try {
                await UserService.GetUserByEmail("THIS_FAILS")
                assert.fail()
            } catch (err) {
                assert.equal(err.message, Messages.User.DoesntExist)
            }
        })
    })

    describe("UpdateUser", function () {
        it.skip("Updates the bio of a user", async () => {
            assert.fail("Not implemented")
        })

        it.skip("Fails if the user tries to update another user", async () => {
            assert.fail("Not implemented")
        })
    })

    this.afterAll(async () => {
        //drop the collections
        await UserModel.deleteMany()
    })
})
