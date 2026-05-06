require("dotenv").config();
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const session = require("express-session");


const app = express()


// DB
const ConnectDatabase = require('./app/config/dbConfig')
ConnectDatabase()



app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(morgan('dev'))
app.use(
  helmet({
    contentSecurityPolicy: false,
    xDownloadOptions: false,
  }),
);


app.use("/api/v1", require("./app/routes/index"))



app.listen(process.env.PORT, (err)=>{
  if(err){
    console.log(`failed to start the server ${err} `)
  }
  console.log(`Server running on port http://localhost:${process.env.PORT}`)
})