module.exports = (AuthModel, ValidatePassword) => {
    if (!AuthModel || !ValidatePassword) throw new Error("Parameters required.")

    return async function VerifyPassword(email, password) {
        let authDoc = await AuthModel.findOne({ email }).catch(err => {
            throw new Error(err.message)
        })

        return ValidatePassword(password, authDoc.password, authDoc.salt) //bool
    }
}
