const express = require('express');
const route = express.Router();

// Middleware
const authenticateToken = require('../middleware/auth.middleware.js');


const dashboardController = require('../controller/dashboard/dashboard.controller.js');


route.post('/quiz',authenticateToken,dashboardController.getDashboardQuiz)


module.exports = route