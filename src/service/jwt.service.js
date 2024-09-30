const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;
const User = require('../model/user/user.model');

async function checkJwt(token) {
    try {

        // Error-First Callbacks
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, SECRET_KEY, (error, decoded) => {
                if (error) return reject(new Error('Invalid token'));
                resolve(decoded);
            });
        });

        const userObject = await User.findOne({ _id: decoded.id });
        if (!userObject) throw new Error('User not found');

        return userObject.id;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = checkJwt;
