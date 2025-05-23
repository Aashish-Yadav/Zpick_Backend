const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const UserRoutes = require('./Routes/UserRoutes')
const bodyParser = require("body-parser")
const ContactRoutes = require('./Routes/ContactRoutes')
const uploadRoutes = require('./Routes/uploadRoutes')
const Product = require('./Routes/ProductRoutes')
const SearchRoutes = require('./Routes/SearchRoutes')


const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({
    origin:true,
    credentials:true
}))


app.get('/',(req, res)=>{
    res.send("server is runnning")
})

app.use('/upload', uploadRoutes);
app.use('/upload', Product);
// app.use('/image', express.static(path.join(__dirname, 'public/temp'))); 
app.use('/user',UserRoutes);
app.use('/', ContactRoutes);
app.use('/product', SearchRoutes);


mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("database connected successfully"))
.catch((err)=>console.log("database is not connected", err))



app.listen(process.env.PORT, ()=>{
    console.log(`server is running at ${process.env.PORT}`)
})


