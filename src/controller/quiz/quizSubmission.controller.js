const Quiz = require('../../model/quiz/quizPack.model');
const sendResponse = require('../../utils/sendResponse');
const asyncHandler = require('../../utils/asyncHanlder');
const mongoose = require('mongoose')
const quizHelper = require('./quizHelpers')


const submitQuiz = asyncHandler(async (req, res) => {
    const { quizId, answers } = req.body
    const session = await mongoose.startSession()
    session.startTransaction(); 
    try {
        const quizObject = await Quiz.findOne({ '_id': quizId })
        if (!quizObject) return sendResponse(res, 404, 'not found')

        const { correctPercentage, totalCorrectAns } = quizHelper.getScore(quizObject, answers)

        // checks quiz hitory + dificulty then gives us the points
        const totalPoints = await quizHelper.calculatePoints(correctPercentage, req.user, quizObject,session)

        req.user.coins.totalCoinsEarned += totalPoints
        req.user.coins.currentBalance += totalPoints

        await req.user.save() // auto levl up logic in pre hook
        return sendResponse(res, 200, 'your score', { result: { totalCorrectAns, correctPercentage }, coin: req.user.coins });

    } catch {
        await session.abortTransaction()
        return sendResponse(res, 500, 'something went wrong');
    } finally {
        session.endSession()
    }
})


module.exports = {
    submitQuiz
}


// sample payload 

// {
//     "quizId": "66f1b740b96bf7b688ad00b4",  // Replace with the actual quiz ID
//     "answers": [
//         {
//             "questionId": "66f1b740b96bf7b688ad00b5",
//             "answer": "Paris"
//         },
//         {
//             "questionId": "66f1b740b96bf7b688ad00ba", 
//             "answer": "4"
//         },
//         {
//             "questionId": "66f1b740b96bf7b688ad00bf", 
//             "answer": "Jupiter"
//         },
//         {
//             "questionId": "66f1b740b96bf7b688ad00c4",  
//             "answer": "Oxygen"
//         },
//         {
//             "questionId": "66f1b740b96bf7b688ad00c9",  
//             "answer": "Australia"
//         },
//         {
//             "questionId": "66f1b740b96bf7b688ad00ce",  
//             "answer": "William Shakespeare"
//         },
//         {
//             "questionId": "66f1b740b96bf7b688ad00d3",  
//             "answer": "Diamond"
//         }
//     ]
// }
