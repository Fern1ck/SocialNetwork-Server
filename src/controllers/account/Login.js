const UserService = require("../../services/user");

module.exports = async function LoginController (req,res,handleError) {
    try{
        if(req.user){
            res.status(200).send(await UserService.GetUserByEmail(req.user.email))
        }
        else{
            res.status(401).json({err: "Invalid login."})
        }
    }
    catch(err){
        handleError(err)
    }
}