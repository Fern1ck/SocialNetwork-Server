const CommentService = require("../services/comment")
const { UserSchemas } = require("../utils/Validation/Schemas")

module.exports.GetPostComments = async (req, res, handleError) => {
    try{
        let Result = await UserService.GetUsers()
        return res.status(200).json({
            data: Result,
        })
    } catch (err) {
        handleError(err)
    }
}

module.exports.GetUserByUsername = async (req, res, handleError) => {
    try {
        let Validated = await UserSchemas.GetUserByUsername.validateAsync(
            req.params
        )
        let Result = await UserService.GetUserByUsername(Validated.username)
        return res.status(200).json({
            user: Result,
        })
    } catch (err) {
        handleError(err)
    }
}

module.exports.UpdateUser = async (req, res, handleError) => {
    try {
        const Validated = await UserSchemas.UpdateUser.validateAsync(req.body)
        let Result = await UserService.UpdateUser(
            Validated.username,
            Validated.bio
        )
        return res.status(200).json({
            users: Result,
        })
    } catch (err) {
        handleError(err)
   }
}