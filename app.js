const express=require('express');
require('dotenv').config();
const http =require("http");
// db
const connection=require("./config/connection")
// 
var cors=require('cors');
const app=express();
app.use(cors())
app.use(express.urlencoded({extended:true}));
app.use(express.json());
// 
app.use("/form",require("./routes/schema"));
app.use("/user",require("./routes/userDetails"));
const server=http.createServer(app);
server.listen(process.env.PORT);
console.log(`server is running on port ${process.env.PORT}`)