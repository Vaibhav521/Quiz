const z = require('zod')

const challangeUserSchema = z.object({
    quizId: z.string(),
    userId: z.string()
})


module.exports = {
    challangeUserSchema
}