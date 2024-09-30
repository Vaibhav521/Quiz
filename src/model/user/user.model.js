const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        default: 1
    },
    aboutMe: {
        type: String,
        default: ''
    },
    profilePic: {
        type: String,
        default: ''
    },
    coins: {
        currentBalance: {
            type: Number,
            default: 0
        },
        totalCoinsEarned: {
            type: Number,
            default: 0
        }
    },
    quizStats: {
        toalQuizzesTaken: {
            type: Number,
            default: 0
        },
        averageScore: {
            type: Number,
            default: 0
        },
        bestCategory: {
            type: String,
            default: ''
        }
    },
    themes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theme'
    }],
    activeTheme: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theme',
        default: null
    }
},
    {
        timestamps: true
    })








// this pre run when we save doc
userSchema.pre('save', async function (next) {

    // if we alrey got password it means password is isModified , we ony need to run this when we dont have password == new user
    if (!this.isModified('password')) return next()

    try {
        const slat = await bcrypt.genSalt(10); // still dono waht ths does
        this.password = await bcrypt.hash(this.password, slat)
        next()
    } catch (err) {
        next(err);
    }


})


// anonymous function or function expression 
userSchema.methods.confirmPassword = async function (userPassword) {

    try {
        if (!this.password) {
            throw new Error('Stored password is undefined');
        }
        const isMatch = await bcrypt.compare(userPassword, this.password)
        return isMatch

    } catch (error) {
        throw error
    }

}

userSchema.methods.getPublicInfo = function () {
    return {
        user: {
            id: this._id,
            userName: this.userName,
            email: this.email,
            aboutMe: this.aboutMe,
            activeTheme: this.activeTheme,
            themes: this.themes,
        },
        gameStats: {
            level: this.level,
            quizStats: this.quizStats,
            coins: this.coins
        }
    }
}



userSchema.methods.calculateLevel = function () {
    const baseThreshold = 100; // Level 2 base
    const levelFactor = 1.4; // Multiplier idar

    let level = this.level;

    // get the current thresholld for leveling up
    let currentThreshold = baseThreshold * Math.pow(levelFactor, level - 1);

    //update 
    const calculateNextThreshold = (level) => {
        return Math.floor(baseThreshold * Math.pow(levelFactor, level - 1));
    };

    while (this.coins.totalCoinsEarned >= currentThreshold) {
        level++;
        currentThreshold = calculateNextThreshold(level);
    }

    return level;
}



userSchema.pre('save', async function (next) {
    if (this.isModified('coins.totalCoinsEarned')) {
        this.level = this.calculateLevel();
    }
    next();
});




module.exports = mongoose.model('User', userSchema)