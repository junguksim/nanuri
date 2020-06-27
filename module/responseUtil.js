const responseUtil = {
    successTrue: (code, message, data) => {
        return {
            status: code,
            message: message,
            data: data
        }
    },
    successFalse: (code ,message) => {
        return {
            status: code,
            message: message
        }
    }
};

module.exports = responseUtil;