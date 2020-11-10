const express = require("express")
const bcrypt = require('bcryptjs')

const Users = require("./users-model")
const secure = require("../api/secure")

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


module.exports = router