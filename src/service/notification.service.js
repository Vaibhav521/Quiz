const Notification = require('../model/social/notification.model');
const socketIo = require('socket.io');
const checkJwt = require('./jwt.service');
let io;

const initSocket = async (server) => {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            allowedHeaders: ['my-custom-header'],
            credentials: true
        }
    });

    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        console.log(token, 'token');

        try {
            const userId = await checkJwt(token);
            console.log(userId, 'userId');

            if (userId) {
                socket.userId = userId;
                next();
            } else {
                socket.emit('authError', 'Authentication failed');
                return next(new Error("Authentication error"));
            }
        } catch (error) {
            socket.emit('authError', 'Authentication failed');
            return next(new Error("Authentication error"));
        }
    });

    io.on('connection', async (socket) => {
        socket.join(socket.userId)
        socket.on('disconnect', () => {
            console.log(`${socket.userId} disconnected`);
        });
    });
};

const createNotification = async (userId, type, message) => {
    try {
        const newNotification = new Notification({
            for: userId,
            typeOf: type,
            message: message
        });
        await newNotification.save();

        io.to(userId).emit('newNoti', newNotification);
        return newNotification;
    } catch (err) {
        throw new Error('Something went wrong');
    }
};

const getUserNotification = async (userId) => {
    try {
        const notifications = await Notification.find({ 'for': userId });
        return notifications;
    } catch (err) {
        console.error('Error fetching notifications:', err);
        throw new Error('Something went wrong');
    }
};

module.exports = {
    initSocket,
    createNotification,
    getUserNotification
};
