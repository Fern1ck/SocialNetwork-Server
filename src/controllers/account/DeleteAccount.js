const AccountService = require("../../services/account")
const { AccountSchemas } = require("../../utils/Validation/Schemas")

module.exports = async function DeleteAccountController(req, res, handleError) {
    try {
        const Validated = await AccountSchemas.DeleteAccount.validateAsync(
            req.body
        )
        let ResultMessage = await AccountService.DeleteAccount(
            req.user,
            Validated.password
        )
        req.logout()
        res.status(200).json({
            message: ResultMessage,
        })
    } catch (err) {
        handleError(err)
    }
}
