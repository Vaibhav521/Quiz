const express = require('express')

const route = express.Router();

// Middleware
const authenticateToken = require('../middleware/auth.middleware.js');
const validateSchema  = require('../middleware/validate.middleware.js')

const socialController = require('../controller/social/interaction.controller.js')
const socialSchema = require('../schema/interaction.schema.js')


route.post('/follow/:id', authenticateToken, socialController.followUser)
route.put('/unfollow/:id', authenticateToken, socialController.unFollowUser)
route.post('/challenge/:id', authenticateToken,validateSchema(socialSchema.challangeUserSchema), socialController.challangeUser)

