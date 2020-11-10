const express = require("express")
const bcrypt = require('bcryptjs')

const Users = require("./users-model")
const secure = require("../api/secure")
const server = require("../api/server")

const router = express.Router()

router.get("/", secure, (req,res) =>{
    Users.find()
    .then((users) => {
        res.status(200).json(users)
    })
    .catch(err => {
        res.status(400).json({message: err.message})
    })
})

router.post("/auth/register", async (req, res) =>{
    try{
        const {username, password} = req.body
        const hash = bcrypt.hashSync(password, 10)
        const user = { username, password: hash, role: 2}
        const addedUser = await Users.newUser(user)
        res.json(addedUser)
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
})

router.post("/auth/login", async (req, res) =>{
    try{
        const [user] = await Users.findBy({ username: req.body.username})
        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            req.session.user = user
            res.json({ message: `Welcome Back, ${user.username}`})
        } else {
            res.status(401).json({ message: "YOU SHALL NOT PASS!"})
        }
    } catch (err){
        res.status(500).json({message: err.message})
    }
})

router.get('/auth/logout', (req, res) =>{
    if(req.session && req.session.user) {
        req.session.destroy(err =>{
            if (err) res.json({message: "you shall not leave"})
            else res.json({ message: 'adios'})
        })
    } else {
        res.json({ message: 'nothing to do here'})
    }
})



module.exports = router