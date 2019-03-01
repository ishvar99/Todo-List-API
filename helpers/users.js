const User=require('../models/users');
const _=require('lodash');
const jwt=require('jsonwebtoken')
exports.addUser=(req,res)=>{
       var body=_.pick(req.body,['email','password']);
       User.create(body)
       .then((user)=>{
       	var token=user.generateToken();
       	//user.toJSON() will return the modified user
       	res.header('x-auth',token).send(user);
       }) 
       .catch((error)=>{
       	console.log(error)
       })
}
exports.verifyUser=(req,res)=>{
	var body=_.pick(req.body,['email','password'])
      User.findByCredentials(body)
      .then((user)=>{
         if(!user)
         	res.status(401).send('Authenticaton Failed!')
         else
         	res.header('x-auth',user.tokens[0].token).send(user);
      })
      .catch((e)=>{
           res.status(401).send(e);
      })
}
exports.getUser=(req,res)=>{
	res.send(req.user);
}
module.exports=exports;
