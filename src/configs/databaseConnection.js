const mongoose = require('mongoose')
const { DB_URL } = require('./constants')


async function connectDatabase() {
    try {
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => console.log('MongoDB connected'))
            .catch(err => console.error('MongoDB connection error:', err));
    } catch (err) {
        console.log(err)
        process.exit(1) 
    }
}

module.exports = connectDatabase