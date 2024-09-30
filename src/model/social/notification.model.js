const mongoose = require('mongoose')

const useNotificationModel = mongoose.Schema({
    for: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    typeOf: {
        type: String,
        enum: ['follow', 'challange', 'shop', 'qiz','personal'],
        required: true
    },
    message: {
        type: String,
        require: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
})


module.exports = mongoose.model('Notification',useNotificationModel)