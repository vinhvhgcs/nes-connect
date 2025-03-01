const express = require ('express')
const cors = require ('cors')
const bodyParser =require ('body-parser')
const cookieParser = require('cookie-parser');
const helmet = require('helmet')
const dotenv = require('dotenv')
const http = require('http')
const {Server} = require('socket.io')

const { checkUser, requireToken } = require('./middlewares/authJwt');
const api = require('./routes/index')
const controller = require("./controllers/auth.controller");

const app = express()
const port = process.env.port || 3333

//Env file & DB connect
dotenv.config()
require("./database/DBconnect")






//Middleware
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())

//Routes
app.use(api)
app.get("*", checkUser);


const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:"*",
        methods:['GET,POST']
    }
})


//Real Time connection
io.on("connection",(socket)=>{
    console.log("user connected")
    socket.on("join-room",()=>{
        console.log("user join a room")
    })

    socket.on("disconnect",()=>{
        console.log("user disconnected")
    })
})

//Port
server.listen(port, ()=> {
    console.log('Server is listen to port:', port)
    controller.initial();
})