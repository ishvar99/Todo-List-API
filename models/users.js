const mongoose=require('mongoose'),
jwt=require('jsonwebtoken'),
validator=require('validator'),
bcrypt=require('bcryptjs'),
_=require('lodash');
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
userSchema.methods.toJSON=function(){
	var user=this;
	return _.pick(user,['_id','email']);
}
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
//Mongoose middleware which runs before the database is saved
//Runs before user.save() method
userSchema.pre('save', function(next) {
	var user=this;
	if(user.isModified('password'))
	{
 bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
        user.password=hash;
        next();  //After the next() call,the database would be saved
        //i.e user.save() would be executed
    });
});
}
else
  next();
});
userSchema.statics.verifyCredentials=function(){

}
module.exports=mongoose.model('user',userSchema);