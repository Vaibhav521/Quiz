const QuizPack = require('../../model/quiz/quizPack.model')
const sendResponse = require('../../utils/sendResponse');
const asyncHandler = require('../../utils/asyncHanlder');
const { pipeline } = require('zod');
const mongoose = require('mongoose')



// will add  pagination laterrr
const getDashboardQuiz = asyncHandler(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const quiz = await QuizPack.aggregate([

        // satge we match and get idaar
        {
            $match: {
                $or: [
                    { name: { $regex: req.body.query, $options: 'i' } },
                    { description: { $regex: req.body.query, $options: 'i' } }
                ]

            }
        },
        // stage 2 we wana get if we have takn this quiz or not
        {
            $lookup: {
                from: 'quizhistories',
                let: { quizId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$quizId', '$$quizId'] },
                                    { $eq: ['$userId', userId] }
                                ]

                            }
                        }
                    },
                    {
                        $project: {
                            topScore: 1,
                            totalAttempt: 1
                        }
                    }
                ],

                as: 'quizHistory'
            }
        },
        // and user also 
        {
            $lookup: {
                from: 'users',
                let: { userId: '$createdBy' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$_id', '$$userId']
                            }
                        }
                    },
                    {
                        $project: {
                            userName: 1,
                            id: 1
                        }
                    }
                ] ,
                as: 'quizUser'
            }

        },
        // we then deconstruct that arrry
        {
            $unwind: {
                path: '$quizHistory',
                preserveNullAndEmptyArrays: true
            }
        },
        // final output stage
        {
            $project: {
                name: 1,
                description: 1,
                difficulty: 1,
                points: 1,
                history: {
                    topScore: { $ifNull: ['$quizHistory.topScore', 0] },
                    totalAttempt: { $ifNull: ['$quizHistory.totalAttempt', 0] }
                },
                createdBy : '$quizUser'
            }
        }
    ])
    if (!quiz) return sendResponse(res, 404, 'No quiz found')
    return sendResponse(res, 200, 'Quizzes retrieved successfully', quiz);
})


module.exports = {
    getDashboardQuiz
}