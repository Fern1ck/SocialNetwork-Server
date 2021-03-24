const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const AuthModel = require("../../models/Auth")
const UserModel = require("../../models/User")
const {ValidatePassword} = require('./passwordUtils')

const customFields = {
    usernameField: 'email',
    passwordField: 'password'
};

const verifyCallback = (email, password, done) => {
    AuthModel.findOne({ email })
        .then((user) => {
            if (!user) { 
                return done(null, false) 
            }
            
            const isValid = ValidatePassword(password, user.password, user.salt);
            return isValid ? done(null, user) : done(null, false)
        })
        .catch((err) => {   
            done(err);
        });
}

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy); 

//saves to session. it's called when logging in
passport.serializeUser((authDoc, done) => {
    done(null, authDoc);
});

//user object attaches to the request as req.user. it's called when checking if the user is logged in
passport.deserializeUser((authDoc, done) => {
    UserModel.findById(authDoc.userID)
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err))
});

