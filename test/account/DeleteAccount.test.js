const AccountService = require("../../src/services/account")
const { assert } = require("chai")
const UserModel = require("../../src/models/User")
const { ConnectToMongoDB } = require("./../../src/MongoDB")
const config = require("../../config")
const AuthModel = require("../../src/models/Auth")

describe("DELETE ACCOUNT", function () {
    const email = "test@gmail.com"
    const username = "test123"
    const password = "testpassword123"

    this.beforeAll(async () => {
        await ConnectToMongoDB(config.MONGOURI_TESTDB)
        await UserModel.deleteMany()
        await AuthModel.deleteMany()
    })
    it('Deletes the user document and the auth document -- Depends on "SIGN UP"', async () => {
        try {
            await AccountService.SignUp(email, username, password)
            await AccountService.DeleteAccount(email, password)
            let UserDoc = await UserModel.findOne({ email })
            let AuthDoc = await UserModel.findOne({ email })
            assert.isNull(UserDoc)
            assert.isNull(AuthDoc)
        } catch (err) {
            assert.fail(err.message)
        }
    })

    it.skip("Deletes the user posts after deletion", async () => {
        assert.fail("Not implemented")
    })

    it.skip('Removes the "likes" the user has given to posts', async () => {
        assert.fail("Not implemented")
    })

    it.skip('Removes the "likes" the user has given to comments', async () => {
        assert.fail("Not implemented")
    })

    it.skip("Deletes the user comments", async () => {
        assert.fail("Not implemented")
    })

    it.skip('Removes the "likes" users have given to the deleted user posts', async () => {
        assert.fail("Not implemented")
    })

    it.skip("Removes the comments from users on the deleted user posts", async () => {
        assert.fail("Not implemented")
    })

    it.skip('Removes the "likes" given from users to the deleted user comments', async () => {
        assert.fail("Not implemented")
    })

    this.afterAll(async () => {
        //drop the collections
        await UserModel.deleteMany()
        await AuthModel.deleteMany()
    })
})
