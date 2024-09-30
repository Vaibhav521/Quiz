const QuizHistory = require('../../model/quiz/quizHistory.model')

const getScore = (quizObject, answers) => {

    const correctAnswersMap = {};
    quizObject.questions.forEach((question, index) => {
        correctAnswersMap[question._id] = question.options.find(option => option.isCorrect).optionText;
    });



    let totalCorrectAns = 0;
    answers.forEach(answer => {
        const correctAnswer = correctAnswersMap[answer.questionId];

        if (correctAnswer && correctAnswer === answer.answer) {
            totalCorrectAns++;
        }
    });


    const totalQuestions = quizObject.questions.length;
    const correctPercentage = Math.floor((totalCorrectAns / totalQuestions) * 100);

    return {
        correctPercentage: correctPercentage,
        totalCorrectAns: totalCorrectAns
    };
};


async function calculatePoints(correctPercentage,user,quiz,session) {
    let points = 0
    switch (quiz.difficulty) {
        case 'easy':
            points = 15
            break;
        case 'medium':
            points = 30
            break;
        case 'hard':
            points = 50
            break;
        default:
            points = 15
    }

    let totalPoints ;

    const historyId = await QuizHistory.findOne({ 'userId': user.id, 'quizId': quiz.id }).session(session)
    if (historyId) {
        if (correctPercentage > historyId.topScore) {
            totalPoints = Math.floor(points * ( Math.floor(correctPercentage - historyId.topScore)  / 100));
            historyId.topScore = correctPercentage
        }else{
            totalPoints = 0
        }
        historyId.totalAttempt += 1
        await historyId.save({session})
    } else {
        const history = new QuizHistory({
            userId: user.id,
            quizId: quiz.id,
            topScore: correctPercentage,
            totalAttempt: 1
        })
        await history.save({session})
        user.quizStats.toalQuizzesTaken += 1
        await user.save({session})
        totalPoints = Math.floor(points * (correctPercentage / 100));
    }


    return totalPoints

}

module.exports = {
    getScore,
    calculatePoints
};