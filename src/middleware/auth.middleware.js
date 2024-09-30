const jwt = require('jsonwebtoken');
const sendResponse = require('../utils/sendResponse');
const SECRET_KEY = process.env.SECRET_KEY;
const User = require('../model/user/user.model');

async function authenticateToken(req, res, next) {
    try {

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];  // idar ['Bearer', 'abc123'] so we take token

        if (!token) return sendResponse(res, 401, 'unauthorized')


        //synchronous callback" or "error-first callback" 
        jwt.verify(token, SECRET_KEY, async (error, decoded) => {
            if (error) return sendResponse(res, 401, 'unauthorized')

            const userObject = await User.findOne({ _id: decoded.id })
            .populate('activeTheme')
            .populate('themes');
        
            req.user = userObject
            next()
        })



    } catch (error) {
        sendResponse(res, 401, 'unauthorized')
    }

}


module.exports = authenticateToken