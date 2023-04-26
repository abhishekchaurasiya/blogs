class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
};

// Error handler for User
const errorMiddleWare = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;
    return res.status(err.statusCode).json({
        status: false,
        message: err.message
    });
};

module.exports = { errorMiddleWare, ErrorHandler };