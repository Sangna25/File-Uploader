require("dotenv").config();

const express = require("express");
const app = express();
const passport= require("passport");
const session = require("express-session");
const cors= require("cors");



app.use(cors({
     origin: process.env.CLIENT_URL,
  credentials: true
}));


const initializePassport = require("./config/passport");


initializePassport(passport)




app.use(express.json());
app.use(express.urlencoded({extended :false}));

app.use(session({
    secret : process.env.SESSION_SECRET,
    resave :false,
    saveUninitialized:false
}))


app.use(passport.initialize());
app.use(passport.session());


const authRouter = require("./routes/authRouter");
const driveRouter = require("./routes/driveRouter");

app.use("/auth", authRouter);
app.use("/mydrive", driveRouter)

app.listen(8080, () =>{
    console.log("Server running on port 8080")
})