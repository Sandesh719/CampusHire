import app from './app.js'
import databaseConnection from './config/database.js'
import dotenv from 'dotenv'
dotenv.config({path:"./config/config.env"})


databaseConnection()



app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})