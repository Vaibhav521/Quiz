const mongoose = require('mongoose')


const quizQuestionSchema = mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    options: [{
        optionText: {
            type: String,
            required: true
        },
        isCorrect: {
            type: Boolean,
            required: true
        }
    }
    ]

},)

const useQuizPackSchema = mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    discription: {
        type: String,
    },
    type: {
        type: String,
        enum: ['multi', 'isUp', 'streak'],
        default: 'multi'
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    points: {
        type: String,
        default: 0,
    },
    questions: {
        type: [quizQuestionSchema],
        required: true
    },
}, {
    timestamps: true
})



quizQuestionSchema.pre('save', async function (next) {
    if (this.isModified('points')) return next()

    switch (this.difficulty) {
        case 'easy':
            this.points = 15
            break;
        case 'medium':
            this.points = 30
            break;
        case 'hard':
            this.points = 50
            break;
        default:
            this.points = 15
    }
})

module.exports = mongoose.model('QuizPack', useQuizPackSchema)




// sample payload 
// {
//     "createdBy": "60c72b2f4f1a2c001f4e2d7b",
//     "name": "General Knowledge Quiz",
//     "discription": "A fun quiz to test your general knowledge!",
//     "packSize": 5,
//     "type": "multi",
//     "questions": [
//         {
//             "questionText": "What is the capital of France?",
//             "options": [
//                 { "optionText": "Berlin", "isCorrect": false },
//                 { "optionText": "Madrid", "isCorrect": false },
//                 { "optionText": "Paris", "isCorrect": true },
//                 { "optionText": "Rome", "isCorrect": false }
//             ]
//         },
//         {
//             "questionText": "What is 2 + 2?",
//             "options": [
//                 { "optionText": "3", "isCorrect": false },
//                 { "optionText": "4", "isCorrect": true },
//                 { "optionText": "5", "isCorrect": false },
//                 { "optionText": "6", "isCorrect": false }
//             ]
//         },
//         {
//             "questionText": "What is the largest planet in our solar system?",
//             "options": [
//                 { "optionText": "Earth", "isCorrect": false },
//                 { "optionText": "Jupiter", "isCorrect": true },
//                 { "optionText": "Mars", "isCorrect": false },
//                 { "optionText": "Saturn", "isCorrect": false }
//             ]
//         }
//     ]
// }
