const UserModel = require("../../models/User")
const AuthModel = require("../../models/Auth")
const {ValidatePassword} = require("../../utils/Authentication/passwordUtils")
const {GeneratePassword} = require("../../utils/Authentication/passwordUtils")

const SignUp = require("./SignUp")
const DeleteAccount = require("./DeleteAccount")
const ChangePassword = require("./ChangePassword")
const VerifyPassword = require("./VerifyPassword")

module.exports = {
    SignUp: SignUp(UserModel, AuthModel, GeneratePassword),
    DeleteAccount: DeleteAccount(UserModel, AuthModel, VerifyPassword(AuthModel, ValidatePassword)),
    ChangePassword : ChangePassword(AuthModel),
    VerifyPassword : VerifyPassword(AuthModel, ValidatePassword)
}