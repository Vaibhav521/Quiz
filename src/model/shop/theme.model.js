const mongoose = require('mongoose');

const themeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true  
    },
    price: {
        type: Number,
        required: true
    },
    primaryColor: {
        type: String,
        required: true
    },
    secondaryColor: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Theme', themeSchema);
