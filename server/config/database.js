import mongoose from "mongoose";

const databaseConnection = () => {
    mongoose.connect(process.env.DB,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then((data)=>{
        console.log(`database connected successfully at server ${data.connection.host}`)
    })
}
export default databaseConnection;
