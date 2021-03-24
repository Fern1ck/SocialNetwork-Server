const Joi = require("joi")
const {
    ValidID,
    ValidUsername,
    ValidBio,
    ValidEmail,
    ValidPassword,
    ValidFollowType,
    ValidTextContent,
} = require("./ValidObjects")

class AccountSchemas {
    static SignUp = Joi.object({
        email: ValidEmail,
        username: ValidUsername,
        password: ValidPassword,
    })

    static ChangePassword = Joi.object({
        old_password: ValidPassword,
        new_password: ValidPassword,
        repeat_password: ValidPassword,
    })

    static DeleteAccount = Joi.object({
        password: ValidPassword,
    })
}

class UserSchemas {
    static GetUserByUsername = Joi.object({
        username: ValidUsername,
    })

    static UpdateUser = Joi.object({
        username: ValidUsername,
        bio: ValidBio,
    })
}

class FollowSchemas {
    static GetFollow = Joi.object({
        type: ValidFollowType,
        username: ValidUsername,
    })

    static PostFollow = Joi.object({
        usernameTO: ValidUsername,
    })
}

class PostSchemas {
    static PublishPost = Joi.object({
        textContent: ValidTextContent,
    })

    static GetUserPosts = Joi.object({
        username: ValidUsername,
    })

    static PostLikes = Joi.object({
        postID: ValidID,
    })

    static GetSinglePost = Joi.object({
        postID: ValidID,
    })

    static DeletePost = Joi.object({
        postID: ValidID,
    })
}

module.exports = {
    AccountSchemas,
    UserSchemas,
    FollowSchemas,
    PostSchemas,
}
