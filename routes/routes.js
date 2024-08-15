const express = require('express')

const route = express.Router()
const {signup,login,updateUser,deleteUser,logout,dashboard}=require('../controllers/user_controller')

route.post('/signup', signup)
route.post('/login', login)
route.patch('/updateUser', updateUser)
route.delete('/deleteUser', deleteUser)
route.get('/dashboard', dashboard)
route.post('/logout', logout)

module.exports=route



