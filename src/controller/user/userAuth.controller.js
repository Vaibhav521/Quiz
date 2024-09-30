const jwt = require('jsonwebtoken');
const User = require('../../model/user/user.model');
const SECRET_KEY = process.env.SECRET_KEY;
const sendResponse = require('../../utils/sendResponse');
const asyncHandler = require('../../utils/asyncHanlder');

const login = asyncHandler(async (req, res) => {

    const userObject = await User.findOne({ email: req.body.email })

    if (!userObject) return sendResponse(res, 400, 'user not found')

    const isPassCorrect = await userObject.confirmPassword(req.body.password)

    if (!isPassCorrect) return sendResponse(res, 400, 'email or passowrd is worng')

    const userjwtPayload = {
        id: userObject._id.toString(),
        email: userObject.email
    };

    const token = jwt.sign(userjwtPayload,SECRET_KEY,{ expiresIn: '1h' })

    let responseData = await userObject.getPublicInfo()

    responseData.token = token

    sendResponse(res, 200, 'login', responseData)
})

module.exports = {
    login
}