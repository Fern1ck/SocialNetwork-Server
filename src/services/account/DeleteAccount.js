const Messages = require("../../utils/Messages")

module.exports = (UserModel, AuthModel, VerifyPassword) => {
    if(!UserModel || !AuthModel || !VerifyPassword) throw new Error("Parameters required.")

    return async function DeleteAccount(email, password){
        if (!(await VerifyPassword(email, password))) {
            throw new Error(Messages.Account.DeleteAccount.WrongPassword)
        }
    
        return UserModel.deleteOne({ email })
        .then( () => { 
            return AuthModel.deleteOne({ email })
            .then(() => { 
               return Messages.Account.DeleteAccount.Success
            })
            .catch((err) => {
                 throw new Error("There's been an error: " + err)
            })
        })
        .catch((err) => {
            throw new Error("There's been an error: " + err)
        })
    }
}
