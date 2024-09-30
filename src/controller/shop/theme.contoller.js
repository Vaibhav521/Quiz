const Theme = require('../../model/shop/theme.model');
const sendResponse = require('../../utils/sendResponse');
const asyncHandler = require('../../utils/asyncHanlder');
const mongoose = require('mongoose')

const getAllThemes = asyncHandler(async (req, res) => {
    const themes = await Theme.find()
    sendResponse(res, 200, 'themes loaded', themes)
})

const buyATheme = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const theme = await Theme.findOne({ '_id': req.params.id })
        if (!theme) return sendResponse(res, 404, 'theme not found')
            
        if (req.user.coins.currentBalance < theme.price) return sendResponse(res, 404, 'not enough coins')
        
        req.user.themes.push(theme.id)
        req.user.coins.currentBalance -= theme.price
        
        await req.user.save()
        sendResponse(res, 200, 'done', theme)
    }
    catch {
        await session.abortTransaction()
        return sendResponse(res, 500, 'something went wrong');
    }
    finally {
        session.endSession()
    }
})

const setActiveTheme = asyncHandler(async (req, res) => {
    const theme = await Theme.findById(req.params.id)
    if (!theme) return sendResponse(res, 404, 'theme not found')
    
    // .string jusssst to be saffe
    const haveTheme = req.user.themes.some(themeObj => themeObj._id.toString() == theme._id.toString());
    if (!haveTheme) return sendResponse(res, 400, 'you dont have this theme')

    req.user.set({ activeTheme: theme._id });
    req.user.save()
    sendResponse(res, 200, 'done', theme)
})


const createTheme = asyncHandler(async (req, res) => {
    const theme = new Theme(req.body)
    await theme.save()
    sendResponse(res, 200, 'data created', theme)
})


module.exports = {
    getAllThemes,
    buyATheme,
    setActiveTheme,
    createTheme
}

