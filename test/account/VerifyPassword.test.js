const { assert } = require("chai")
const { ConnectToMongoDB } = require("../../src/MongoDB")
const AuthModel = require("../../src/models/Auth")
const config = require("../../config")
const AccountService = require("../../src/services/account")

describe("VERIFY PASSWORD", function () {
    let AuthDoc
    let email = "test@gmail.com"
    this.beforeAll(async () => {
        await ConnectToMongoDB(config.MONGOURI_TESTDB)

        //password: 12345678
        AuthDoc = await new AuthModel({
            userID: "602a8943b56c6923d80b2629",
            email,
            password:
                "accb9748a53090ee28fa3406da338174658394db41e32d304964076601dc214064698de63f25d7c18b2f9d4540656acb9de360a2ed8f9c9980d9d58ccbe7e7e3",
            salt:
                "70f007328aee6c0d9437bafc1787e293adfd831a289ef9c99a4aff275e002623",
        }).save()
    })

    it("Verifies the password", async () => {
        try {
            let isCorrect = await AccountService.VerifyPassword(
                email,
                "12345678"
            )
            assert.isTrue(isCorrect)
        } catch (err) {
            assert.fail(err.message)
        }
    })

    it("Fails if the password is invalid", async () => {
        try {
            let isCorrect = await AccountService.VerifyPassword(
                email,
                "incorrect_password"
            )
            assert.isFalse(isCorrect)
        } catch (err) {
            assert.fail(err.message)
        }
    })

    this.afterAll(async () => {
        //drop the collection
        await AuthModel.deleteMany()
    })
})
