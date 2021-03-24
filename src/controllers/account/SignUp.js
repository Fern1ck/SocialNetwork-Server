const AccountService = require("../../services/account")
const Messages = require("../../utils/Messages")
const { AccountSchemas } = require("../../utils/Validation/Schemas")

module.exports = async function SignUpController(req, res, next) {
    try {
        const Validated = await AccountSchemas.SignUp.validateAsync(req.body)
        await AccountService.SignUp(
            Validated.email,
            Validated.username,
            Validated.password
        )
        next()
    } catch (err) {
        next(err)
    }
}
