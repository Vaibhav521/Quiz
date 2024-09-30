const express = require('express')
const route =  express.Router()

// middleware
const validateSchema  = require('../middleware/validate.middleware.js')
const authenticateToken = require('../middleware/auth.middleware.js')

// payload schema
const userManagementSchema = require('../schema/user.schema.js')

// controller
const userManagement = require('../controller/user/userManagement.controller.js')
const userAuth = require('../controller/user/userAuth.controller.js')






route.post('/login',validateSchema(userManagementSchema.userLoginschema),userAuth.login)

// user crud
route.post('/create',validateSchema(userManagementSchema.createUserSchema),userManagement.createUser)
route.get('/account',authenticateToken,userManagement.getMydetails)
route.put('/update',authenticateToken,userManagement.updateProfile)



module.exports = route