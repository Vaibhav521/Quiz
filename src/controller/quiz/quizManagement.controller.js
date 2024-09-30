const Quiz = require('../../model/quiz/quizPack.model');
const sendResponse = require('../../utils/sendResponse');
const asyncHandler = require('../../utils/asyncHanlder');

const createQuiz = asyncHandler(async (req, res) => {
    const quizData = {
        ...req.body,
        createdBy: req.user.id
    }
    const quiz = new Quiz(quizData)
    await quiz.save()
    sendResponse(res, 200, 'quiz created', quiz)
})

const updateQuiz = asyncHandler(async (req, res) => {
    const quizData = await Quiz.findOneAndUpdate(
        { _id: id, createdBy: req.user._id },
        { name, discription, type, questions },
        { new: true, runValidators: true } // new == return obj 
    );
    if (!quizData) return sendResponse(res, 404, 'not found')

    sendResponse(res, 200, 'quiz updated', quizData)
})


const deleteQuiz = asyncHandler(async (req, res) => {
    const quizData = await Quiz.deleteOne({ '_id': req.params.id, 'createdBy': req.user.id })
    if (!quizData) return sendResponse(res, 404, 'not found')
    sendResponse(res, 200, 'quiz deleted')
})

const quizById = asyncHandler(async (req, res) => {
    const quizData = await Quiz.findOne({ '_id': req.params.id })
    if (!quizData) return sendResponse(res, 404, 'not found')
    sendResponse(res, 200, 'quiz fetched', quizData)
})

module.exports = {
    createQuiz,
    quizById,
    deleteQuiz,
    updateQuiz
}