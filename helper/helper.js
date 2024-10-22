function sendSuccess(res, statusCode, data, message) {
    res.status(statusCode).send({
        status: 'success',
        data: data,
        message: message
    });
}

function sendFail(res,statusCode,message){
    res.status(statusCode).send({
        status: 'fail',
        message: message
    });
}

const Helper = {
    sendSuccess,sendFail
}

module.exports = Helper;