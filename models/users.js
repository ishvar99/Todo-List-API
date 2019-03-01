const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const validator=require('validator')
var userSchema=new mongoose.Schema({
	email:{
		type:String,
		required:true,
		unique:true,
		validate:{
			validator:value=>validator.isEmail
			//equivalent to validator:(value)=>validator.isEmail(value)
		},
		minlength:1
	},
	password:{
		type:String,
		minlength:6,
		required:true
	},
	tokens:[
	{
		token:{
			type:String,
			required:true
		},
		access:{
			type:String,
			required:true
		}
	}
	]
});
userSchema.methods.generateToken=function(){
	var user=this;
	var access='auth';
	var token=jwt.sign({id:user._id,access},'abc123').toString();
	user.tokens.push({token,access});
	user.save();
	return token;
}
userSchema.statics.findByToken=function(token){
	var User=this;
	var decoded;
	try {
		decoded=jwt.verify(token,'abc123')
	} catch(e) {
		return Promise.reject(e);
	}
    return User.findOne(
    	{'_id':decoded.id,
    	'tokens.token':token,
    	'tokens.access':'auth',    	
         }
 	)    
}
userSchema.statics.verifyCredentials=function(){
	
}
module.exports=mongoose.model('user',userSchema);