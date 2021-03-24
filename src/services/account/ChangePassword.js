const VerifyPassword = require("./VerifyPassword")
const {GeneratePassword} = require("../../utils/Authentication/passwordUtils")
const Messages = require("../../utils/Messages")

module.exports = (AuthModel) => {
    if(!AuthModel) throw new Error("Parameters required.")

    return async function ChangePassword(User, old_password, new_password, repeat_password){
    
        if (!await VerifyPassword(User, old_password)) {
            throw new Error(Messages.Account.ChangePassword.WrongPassword)
        }
    
        if (old_password === new_password) {
            throw new Error(Messages.Account.ChangePassword.SamePassword)
        }
    
        if (new_password !== repeat_password) {
            throw new Error(Messages.Account.ChangePassword.DoesntMatch)
        }
    
        const {passwordHash, salt} = GeneratePassword(new_password)
        
        return AuthModel.findOne({ userID: User.id })
            .then(async (authDoc) => {
                authDoc.password = passwordHash
                authDoc.salt = salt
                await authDoc.save()
            })
            .catch((err) => {
                throw new Error(err)
            })
    }
}

