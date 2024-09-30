const z =  require('zod')

const createThemeSchema = z.object({
    name : z.string().min(2,'Name must be atleast 2 characters').max(50,'Name must be less theen 50 characters') ,
    price : z.number().min(1,'must be atleast 1') ,
    primaryColor : z.string(),
    secondaryColor : z.string()
})



module.exports = {
    createThemeSchema
}