//errorHandler method creates our own error object and sets our own error status code and error message into the obj. We use this when we want to handle our own unique errors and pass our own error obj to our error handling middleware.

export const errorHandler = (statusCode, message) => {
    const error = new Error()
    error.statusCode = statusCode
    error.message = message
    return error
}