const User = require('../../model/user/user.model');
const sendResponse = require('../../utils/sendResponse');
const asyncHandler = require('../../utils/asyncHanlder');
const notification = require('../../service/notification.service')

const createUser = asyncHandler(async (req, res) => {
    const newUser = new User(req.body);
    await newUser.save()
    await notification.createNotification(newUser.id,'personal','welcome to my quiz app!!');
    sendResponse(res, 201, 'User created successfully', newUser);
});

const getMydetails = asyncHandler(async (req, res) => {
    sendResponse(res, 200, 'data fetched', req.user.getPublicInfo())
})

const updateProfile = asyncHandler(async (req, res) => {
    const userObject = req.user
    userObject.aboutMe = req.body.aboutMe
    userObject.userName = req.body.userName
    await userObject.save()
    sendResponse(res, 200, 'data fetched', userObject.getPublicInfo())
})

const getOtherUserDetails = asyncHandler(async (req, res) => {
    const user = await User.findOne({ '_id': req.params.id })
    if (!user) return sendResponse(res, 404, 'user not found')
    sendResponse(res, 200, 'user fetched', user.getPublicInfo())
})

const deleteMyProfile = asyncHandler(async (req, res) => {
    const user = await User.deleteOne({ '_id': req.user.id, 'email': req.user.email })
    if (!user) return sendResponse(res, 404, 'user not found')
    sendResponse(res, 200, 'user del done')
})

module.exports = {
    createUser,
    getMydetails,
    updateProfile,
    getOtherUserDetails,
    deleteMyProfile
}