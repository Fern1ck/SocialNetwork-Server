const Joi = require("joi")

const ValidID = Joi.string()
    .trim()
    .pattern(/^[0-9a-fA-F]{24}$/) //must be valid mongoose id
    .required()

const ValidEmail = Joi.string()
    .required()
    .trim()
    .lowercase()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })

const ValidUsername = Joi.string()
    .trim()
    .pattern(/^[A-Za-z0-9._-]{3,20}$/) // valid username format
    .required()

const ValidPassword = Joi.string().required().min(8).max(128)

const ValidBio = Joi.string().trim().required().max(50)

const ValidTextContent = Joi.string().trim().required().max(2000)

const ValidFollowType = Joi.string()
    .trim()
    .lowercase()
    .valid("followers", "following")
    .required()

module.exports = {
    ValidID,
    ValidEmail,
    ValidUsername,
    ValidPassword,
    ValidBio,
    ValidTextContent,
    ValidFollowType,
}
