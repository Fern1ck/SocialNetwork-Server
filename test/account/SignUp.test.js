const AccountService = require("../../src/services/account")
const { assert } = require("chai")
const UserModel = require("../../src/models/User")
const { ConnectToDB } = require("./../../src/MongoDB")
const config = require("../../config")
const AuthModel = require("../../src/models/Auth")
const Messages = require("../../src/utils/Messages")

describe("SIGN UP", function() {
    const email = "test@gmail.com"
    const username = "test123"
    const password = "testpassword123"

    this.beforeAll(async () => {
        await ConnectToDB(config.MONGOURI_TESTDB)
        await UserModel.deleteMany()
        await AuthModel.deleteMany()
    })
    it("Signs the user up correctly", async () => {
      try{
          await AccountService.SignUp(email, username, password)
          let User = await UserModel.findOne({email})
          assert.equal(User.email, email)
          assert.equal(User.username, username)

          let AuthDoc = await AuthModel.findOne({email})
          assert.isNotNull(AuthDoc)
        }
        catch (err){
          assert.fail(err.message)
        }
    });

    it("Fails if the email is being used", async () => {
      try{
        await AccountService.SignUp(email, username, password)
        assert.fail()
      }
      catch (err){
        assert.equal(err.message, Messages.Account.SignUp.EmailAlreadyExists)
      }
    })

    it("Fails if the username is taken", async () => {
      try{
        await AccountService.SignUp(email + 1, username, password)
        assert.fail()
      }
      catch (err){
        assert.equal(err.message, Messages.Account.SignUp.UsernameAlreadyExists)
      }
    })

    this.afterAll(async () => {
      //drop the collections
      await UserModel.deleteMany() 
      await AuthModel.deleteMany()
    })
})
