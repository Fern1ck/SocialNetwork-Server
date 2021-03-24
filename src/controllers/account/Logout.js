module.exports = function LogoutController (req,res, handleError) {
    try{
        req.logout()
        res.status(200).send()
    }
    catch (err){
        handleError(err)
    }
}