const mongoose = require("mongoose")

const mondbUrl="mongodb+srv://gcvjsdcjdvfb:8cO8c30H90wUz3Uk@cluster0.gwuaxmx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const connectDb=()=>{
    return mongoose.connect(mondbUrl);

}

module.exports={connectDb}