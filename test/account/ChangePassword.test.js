const {assert} = require("chai")
const { ConnectToDB } = require("../../src/MongoDB")
const UserModel = require("../../src/models/User")
const AuthModel = require("../../src/models/Auth")
const config = require("../../config")
const AccountService = require("../../src/services/account")
const Messages = require("../../src/utils/Messages")

describe("CHANGE PASSWORD -- Depends on \"SIGN UP\"", function() {
  let email = "test@gmail.com"
  let user
  const password = "12345678"
  const newPassword = "1234567890"

    this.beforeAll(async () => {
        await ConnectToDB(config.MONGOURI_TESTDB);
        user = await AccountService.SignUp(email, "test123", password)
    })
    
    it("Changes the password of a user", async() => {
      try{
        await AccountService.ChangePassword(user, password, newPassword, newPassword)
        assert.isTrue(await AccountService.VerifyPassword(email,newPassword))

        //cleanup -- changes the password back to the previous one
        await AccountService.ChangePassword(user, newPassword, password, password)
      }
      catch (err){
        assert.fail(err.message)
      }
    })

    it.skip("Fails if the current password is incorrect", async() => {
      try{
        await AccountService.ChangePassword(user,"THIS_FAILS", newPassword, newPassword)
        assert.fail()
      }
      catch(err){
        assert.equal(err.message, Messages.Account.ChangePassword.WrongPassword)
      }
    })

    it("Fails if the new password matches the current password", async() => {
      try{
        await AccountService.ChangePassword(user,password, password, newPassword)
        assert.fail()
      }
      catch(err){
        assert.equal(err.message,Messages.Account.ChangePassword.SamePassword)
      }
    })

    it("Fails if the new password doesn't match the repeated password", async () => {
      try{
        await AccountService.ChangePassword(user,password, "THIS_FAILS", newPassword)
        assert.fail()
      }
      catch(err){
        assert.equal(err.message,Messages.Account.ChangePassword.DoesntMatch)
      }
    })

    this.afterAll(async () => {
      //drop the collections
      await UserModel.deleteMany() 
      await AuthModel.deleteMany()
    })
})
