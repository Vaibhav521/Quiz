const z = require('zod')


const getDashboardQuizSchema = z.object({
    query: z.string()
})



module.exports = {
    getDashboardQuizSchema
}