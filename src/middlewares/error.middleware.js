const ApiError = require('../exceptions/api.exception')

const errorMiddleware = (err, req, res, next) => {
    console.log("🚀 ~ errorMiddleware ~ err:", err)

    if (err instanceof ApiError) {
        return res.status(err.status).json({message: err.message, errors: err.errors});
    }

    return res.status(500).json({message: "Unexpected error.", error: err.errors});
}

module.exports = { errorMiddleware };