const FollowService = require("../services/followSystem/")
const { FollowSchemas } = require("../utils/Validation/Schemas")

//AUTH ROUTE
module.exports.GetFollow = async (req, res, handleError) => {
    try {
        const input_data = {
            type: req.query.type,
            username: req.params.username,
        }

        const Validated = await FollowSchemas.GetFollow.validateAsync(
            input_data
        )

        let Users = []
        if (Validated.type.toLowerCase() === "followers") {
            Users = await FollowService.GetFollowers(Validated.username)
        } else {
            Users = await FollowService.GetFollowing(Validated.username)
        }

        return res.status(200).json({
            data: Users,
        })
    } catch (err) {
        handleError(err)
    }
}

module.exports.ToggleFollow = async (req, res, handleError) => {
    try {
        const Validated = await FollowSchemas.PostFollow.validateAsync(req.body)
        let Result
        Result = await FollowService.ToggleFollow(
            req.user,
            Validated.usernameTO
        )
        return res.status(200).json({
            message: Result,
        })
    } catch (err) {
        handleError(err)
    }
}
