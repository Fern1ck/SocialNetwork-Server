const Messages = require("../Messages")

const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).json({ error: Messages.Auth.NotAuth });
    }
}

const isNotAuth = (req, res, next) => {
    if (req.isUnauthenticated()) {
        next();
    } else {
        res.status(401).json({ error: Messages.Auth.AlreadyHasAccount });
    }
}

module.exports= {isAuth, isNotAuth}