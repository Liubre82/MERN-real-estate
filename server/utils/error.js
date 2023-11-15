//errorHandler method creates our own error object and sets our own error status code and error message into the obj. 

export const errorHandler = (statusCode, message) => {
    const error = new Error()
    error.statusCode = statusCode
    error.message = message
    return error
}