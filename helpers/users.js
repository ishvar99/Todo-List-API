const User=require('../models/users');
const _=require('lodash');
const jwt=require('jsonwebtoken')
exports.addUser=(req,res)=>{
       var body=_.pick(req.body,['email','password']);
       User.create(body)
       .then((user)=>{
       	user.generateToken()
       	.then((token)=>{
       		 var {token}=token.tokens[0];   
       		res.header('x-auth',token).send(user);
       	})
       	//user.toJSON() will return the modified user       	
       })
       .catch((error)=>{
       	console.log(error)
       })

}
exports.verifyUser=(req,res)=>{
	var body=_.pick(req.body,['email','password'])
      User.findByCredentials(body)
      .then((user)=>{
      	 return user.generateToken().then((token)=>{
      	 	 var {token}=token.tokens[0];  
      	 	res.header('x-auth',token).send(user);
      	 }) 	
      })
      .catch((e)=>{
           res.status(401).send(e);
      })
}

exports.getUser=(req,res)=>{
	res.send(req.user);
}
exports.removeUser=(req,res)=>{
	req.user.removeCredentials().then((user)=>{
		res.status(200).send();
	})
	.catch((e)=>{
		res.status(400).send();
	})
}
module.exports=exports;
