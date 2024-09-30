const express = require('express');
const route = express.Router();

// Middleware
const validateSchema = require('../middleware/validate.middleware.js');
const authenticateToken = require('../middleware/auth.middleware.js');

const quizManagement = require('../controller/quiz/quizManagement.controller');
const quizSchema = require('../schema/quiz.schema');
const quizSubmission = require('../controller/quiz/quizSubmission.controller.js')


route.post('/create', authenticateToken, validateSchema(quizSchema.createQuizSchema), quizManagement.createQuiz);

route.get('/:id', authenticateToken, quizManagement.quizById);

route.post('/submit', authenticateToken, validateSchema(quizSchema.quizSubmit), quizSubmission.submitQuiz)


module.exports = route;
