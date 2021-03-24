const Messages = require("../../utils/Messages")

module.exports = (UserModel) => {
    if (!UserModel) throw new Error("Parameters required.")

    return {
        GetUsers: () => {
            return UserModel.find({}, (err, users) => {
                if (err) {
                    throw new Error(err.message)
                }
                return users
            })
        },

        SimpleFetchByID : (userID) => {
            return UserModel.findOne({ _id: userID }, '_id username')
                .then((user) => {
                    if (!user) {
                        throw new Error(Messages.User.DoesntExist)
                    }
                    return user
                })
                .catch((err) => {
                    if (err) {
                        throw new Error(err.message)
                    }
                })
        },

        GetUserByUsername: (username) => {
            return UserModel.findOne({ username })
                .then((user) => {
                    if (!user) {
                        throw new Error(Messages.User.DoesntExist)
                    }
                    return user
                })
                .catch((err) => {
                    if (err) {
                        throw new Error(err.message)
                    }
                })
        },

        GetUserByEmail: (email) => {
            return UserModel.findOne({ email: email })
                .then((user) => {
                    if (!user) {
                        throw new Error(Messages.User.DoesntExist)
                    }
                    return user
                })
                .catch((err) => {
                    if (err) {
                        throw new Error(err.message)
                    }
                })
        },

        UpdateUser: async (username, bio) => {
            UserModel.findOne({username}, (err, user) => {
                console.log(err, user)
                console.log(user.bio)
            })
        },
    }
}
