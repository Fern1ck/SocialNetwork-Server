const crypto = require('crypto');

function genHash (password, salt) {
    return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

const GeneratePassword = (password) => {
    var salt = crypto.randomBytes(32).toString('hex');
    
    return {
      salt: salt,
      passwordHash: genHash(password, salt)
    };
}

const ValidatePassword = (password, hash, salt) => {
    return hash === genHash(password, salt)
    
}

module.exports = {ValidatePassword, GeneratePassword}