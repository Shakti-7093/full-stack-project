exports.successResponse = (res, data = {}, message = "Success", code = 200) => {
    return res.status(code).json({
        success: true,
        message,
        data,
    });
};

exports.errorResponse = (res, message = "Something went wrong", code = 500) => {
    return res.status(code).json({
        success: false,
        message,
    });
};