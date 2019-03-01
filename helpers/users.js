const User=require('../models/users');
const _=require('lodash');
const jwt=require('jsonwebtoken')
exports.addUser=(req,res)=>{
       var user=_.pick(req.body,['email','password']);
       User.create(user)
       .then((user)=>{
       	var token=user.generateToken();
       	var user=_.pick(user,['_id','email']);
       	res.header('x-auth',token).send(user);
       }) 
       .catch((error)=>{
       	console.log(error)
       })
}
exports.verifyUser=(req,res)=>{
      
}
module.exports=exports;
