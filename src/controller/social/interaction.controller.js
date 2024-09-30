const User = require('../../model/user/user.model');
const sendResponse = require('../../utils/sendResponse');
const asyncHandler = require('../../utils/asyncHanlder');
const Follow = require('../../model/social/follow.model')
const QuizPack = require('../../model/quiz/quizPack.model')
const notification = require('../../service/notification.service')

const followUser = asyncHandler(async (req, res) => {
    const followPerson = await User.findOne({ '_id': req.params.id })
    if (!followPerson) return sendResponse(res, 404, 'user not found')

    const alreadyFollowed = await Follow.findOne({ 'follow': req.user.id, 'following': followPerson.id })
    if (alreadyFollowed) return sendResponse(res, 400, 'you already follow this user')

    const follow = new Follow({
        follow: req.user.id,
        following: followPerson.id
    })

    await follow.save()

    sendResponse(res, 200, 'followed')
})


const unFollowUser = asyncHandler(async (req, res) => {
    const followPerson = await User.findOne({ '_id': req.params.id })
    if (!followPerson) return sendResponse(res, 404, 'user not found')

    const alreadyFollowed = await Follow.findOne({ 'follow': req.user.id, 'following': followPerson.id })
    if (!alreadyFollowed) return sendResponse(res, 400, 'you not have followed this user')


    await Follow.deleteOne({ 'follow': req.user.id, 'following': followPerson.id })

    sendResponse(res, 200, 'unfollowed')

})


const challangeUser = asyncHandler(async (req, res) => {
    const quiz = await QuizPack.findOne({ '_id': req.body.quizId })
    if (!quiz) return sendResponse(res, 404, 'quiz not found')

    const sendUser = await User.findOne({ '_id': req.body.userId })
    if (!sendUser) return sendResponse(res, 404, 'user not found')

    notification.createNotification(sendUser.id, `${req.user.userName} have challanged you for ${quiz.name}`)

    sendResponse(res, 200, 'challange send')
})


module.exports = {
    followUser,
    unFollowUser,
    challangeUser
}