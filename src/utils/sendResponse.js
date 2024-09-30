const sendResponse = (res,status,message,data={}) => {
    res.status(status).json({
        status : status >= 400 ? 'error' : 'success' ,
        message : message ,
        data : data
    })
}

module.exports = sendResponse