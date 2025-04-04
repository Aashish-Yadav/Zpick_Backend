const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const UserRoutes = require('./Routes/UserRoutes')

const app = express();

app.use(express.json())

app.use(cors({
    origin:true,
    credentials:true
}))


app.get('/',(req, res)=>{
    res.send("server is runnning")
})

app.use('/user',UserRoutes);


mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("database connected successfully"))
.catch((err)=>console.log("database is not connected", err))



app.listen(process.env.PORT, ()=>{
    console.log(`server is running at ${process.env.PORT}`)
})


