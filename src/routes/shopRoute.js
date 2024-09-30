const express = require('express');
const route = express.Router();

// Middleware
const authenticateToken = require('../middleware/auth.middleware.js');
const validateSchema  = require('../middleware/validate.middleware.js')
const shopSchema = require('../schema/shop.schema.js')


const shopController = require('../controller/shop/theme.contoller.js');

route.post('/theme',authenticateToken,validateSchema(shopSchema.createThemeSchema),shopController.createTheme)
route.post('/buy/theme/:id',authenticateToken,shopController.buyATheme)
route.get('/theme',authenticateToken,shopController.getAllThemes)
route.put('/set/theme/:id',authenticateToken,shopController.setActiveTheme)




module.exports = route