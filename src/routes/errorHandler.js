const express = require('express')

const errorHandler = express.Router({
    strict:true
})

errorHandler.use((err, req, res, next) => {
    let status_code = err.isJoi === true ? 400 : 500
    return res.status(status_code).json({
        error: err.message,
    }
)})

module.exports = errorHandler