const z = require('zod')

const userLoginschema =  z.object({
    email :  z.string().email("Invaild email"),
    password : z.string().min(6,'Password should be atleast 6 characters') 
})


const createUserSchema = z.object({
    userName : z.string().min(2,'Name must be atleast 2 characters').max(50,'Name must me under 50 characters') ,
    email :  z.string().email("Invaild email"),
    password : z.string().min(6,'Password should be atleast 6 characters') 
})



module.exports = {
    userLoginschema ,
    createUserSchema
}