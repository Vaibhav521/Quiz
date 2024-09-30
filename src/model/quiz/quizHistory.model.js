const mongoose = require('mongoose')
const { number } = require('zod')

const userQuizHistorySchema  = mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User',
        required : true
    },
    quizId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'QuizPack',
        required : true
    },
    topScore : {
        type : Number,
        required : true
    },
    totalAttempt : {
        type : Number,
        default : 0
    }
})

module.exports = mongoose.model('QuizHistory',userQuizHistorySchema)