const AccountService = require("../../services/account")
const { AccountSchemas } = require("../../utils/Validation/Schemas")

module.exports = async function ChangePasswordController(
    req,
    res,
    handleError
) {
    try {
        const Validated = await AccountSchemas.ChangePassword.validateAsync(
            req.body
        )

        await AccountService.ChangePassword(
            req.user,
            Validated.old_password,
            Validated.new_password,
            Validated.repeat_password
        )
        res.status(200).json({
            message: "The password has been changed successfully.",
        })
    } catch (err) {
        handleError(err)
    }
}
