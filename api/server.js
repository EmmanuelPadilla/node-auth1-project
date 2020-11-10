require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')

const session = require('express-session')
const sessionStore = require('connect-session-knex')(session)

const SECRET = process.env.SECRET

const server = express()
server.use(helmet())
server.use(morgan('dev'))
server.use(express.json())
server.use(session({
    name: 'chocchip',
    secret: SECRET,
    cookie: {
        maxAge: 1000*60*10,
        secure: false, //in production must be set to true
        httpOnly: true, //so JS on the page cannot shennaigans
    },
    resave: false, //dot want to recreate sessions that havent changed
    saveUninitialized: false, //this is so session doesnt persist by default
    store: new sessionStore({
        knex: require('../database/dbconfig'),
        tablename: 'sessions', // not Jeff, he wasn't good for much
        sidfieldname: 'sessions', //again, not the pres's lackie
        sidfieldname: 'sid',
        createTable: true,
        clearInterval: 1000 * 60 * 60,
    })
}))

const userRouter = require('../users/users-router')
server.use('/api/', userRouter)




server.get('/', (req, res) =>{
    res.send("the server is running")
})


module.exports=server