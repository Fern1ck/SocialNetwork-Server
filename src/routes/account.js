const express = require('express')
const passport = require('passport')
const Login = require('../controllers/account/Login')
const Logout = require('../controllers/account/Logout')
const SignUp = require('../controllers/account/SignUp')
const DeleteAccount = require('../controllers/account/DeleteAccount')
const ChangePassword = require('../controllers/account/ChangePassword')

const { isAuth, isNotAuth } = require('../utils/Authentication/authMiddleware')

const accountRouter = express.Router({
    strict:true
})

accountRouter.get("/validsession", isAuth, (req,res, handleError) => {
    //if the isAuth middleware doesn't respond with a 401 status code, it means the user session is valid
    try{
        res.status(200).send()
    }
    catch{
        handleError()
    }
})

accountRouter.post("/login", isNotAuth, passport.authenticate('local'), Login)
accountRouter.post("/logout", isAuth, Logout)
accountRouter.post("/signup", isNotAuth, SignUp, passport.authenticate('local'), Login)
accountRouter.post("/deleteaccount", isAuth, DeleteAccount)
accountRouter.post("/changepassword", isAuth, ChangePassword)

module.exports = accountRouter