require('dotenv').config();
const express = require('express')
const http = require('http')
const app = express()
const cors = require('cors')  
const { PORT_NUMBER } = require('./src/configs/constants')
const connectDatabase = require('./src/configs/databaseConnection')
const sendResponse = require('./src/utils/sendResponse')
const notificationService = require('./src/service/notification.service')

const server = http.createServer(app);

connectDatabase()

app.use(cors({
  origin: '*', 
  methods: '*', 
  allowedHeaders: '*' 
}));




//  mota mota we create here a Http server and pass to init the 
// socket thing 
notificationService.initSocket(server)


app.use(express.json());

const quizRoute = require('./src/routes/quizRoute')
const userRoute = require('./src/routes/userRoute')
const dashboardRoute = require('./src/routes/dashboardRoute')
const shopRoute = require('./src/routes/shopRoute')




app.use('/user', userRoute)
app.use('/quiz', quizRoute)
app.use('/dashboard', dashboardRoute)
app.use('/shop', shopRoute)



app.use((err, req, res, next) => {
  console.error(err.stack);
  sendResponse(res, err.statusCode || 500, err.message || 'Something went wrong');
});

server.listen(process.env.PORT_NUMBER, () => {
  console.log(`we are on port ${PORT_NUMBER}`)
})