const Messages = require("../../utils/Messages")

module.exports = (UserModel, AuthModel, GeneratePassword) => {
    if(!UserModel || !AuthModel || !GeneratePassword) throw new Error("Parameters required.")

    return async function SignUp(email, username, password){
        const {passwordHash, salt}  = GeneratePassword(password);

        //Check if the email is taken
        return UserModel.findOne({email})
        .then(doc => {
            if(doc) throw new Error(Messages.Account.SignUp.EmailAlreadyExists)
        
            //Check if the username is taken
            return UserModel.findOne({username})
            .then(doc => {
                if(doc) throw new Error(Messages.Account.SignUp.UsernameAlreadyExists)
            
                //Sign the user up
                return new UserModel({ email, username })
                .save()
                .then(async (user) => {
                    let authdoc = new AuthModel({
                        userID: user._id,
                        email,
                        password: passwordHash,
                        salt
                    })
                    await authdoc.save()
                    return user
                })
            })
        })
    }
}
