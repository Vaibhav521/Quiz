const z = require('zod');

const questionCountMap = {
    easy: 5,
    medium: 10,
    hard: 15,
};


// sub schema

const submitAnsSchema = z.object({
    questionId: z.string(),
    answer: z.string()
})

const optionSchema = z.object({
    optionText: z.string().min(1, 'Option text is required'),
    isCorrect: z.boolean(),
});

const quizQuestionSchema = z.object({
    questionText: z.string().min(1, 'Question text is required'),
    options: z.array(optionSchema)
        .min(4, 'Must have at least 4 options'),
});



//idar schema

const createQuizSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be under 50 characters'),
    description: z.string().min(2, 'description must be at least 2 characters').max(100, 'description must be under 100 characters'),
    createdBy: z.string(),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    questions: z.array(quizQuestionSchema)
        .min(5, 'Quiz pack must have at least 5 questions')
});


const quizSubmit = z.object({
    quizId: z.string(),
    answers: z.array(submitAnsSchema)
})

module.exports = {
    createQuizSchema,
    quizSubmit
};
