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
// userSchema.methods.toJSON=function(){
// 	var user=this;
// 	return _.pick(user,['_id','email']);
// }
userSchema.methods.generateToken=function(){
	var user=this;
	var access='auth';
	var token=jwt.sign({id:user._id,access},'abc123').toString();
	user.tokens.push({token,access});
	return user.save().then((token)=>token);
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
//Here first argument 10, is cost factor which means how much time is needed to calculate a single BCrypt hash.
 bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
        user.password=hash;
        next();  //After the next() call,the database would be saved
        //i.e user.save() would be executed
    });
});
 //The salt is a random value, and should differ for each calculation, 
 //so the result should hardly ever be the same, even for equal passwords. 
}
else
  next();
});
userSchema.statics.findByCredentials=function(body){
    var User=this;
    return User.findOne({email:body.email})
    .then((user)=>{
    	if(!user){
    		return Promise.reject('Invalid Username!')
    	}
    	//Since bcrypt doesn't support promises
    	return new Promise((resolve,reject)=>{
       bcrypt.compare(body.password,user.password,function(err, res) {
       if(res)
      	return resolve(user);
       else
      	return reject('Invalid Password!');
})
    	})
    })
}
userSchema.methods.removeCredentials=function(){
	var user=this;
	var token=user.tokens[0].token;
	return user.update({
		$pull:{
			tokens:{
				token
			}
		}
	})
}
module.exports=mongoose.model('user',userSchema);

//*****HOW BCRYPT WORKS****
// $2y$10$nOUIs5kJ7naTuTFkBy1veuK0kSxUFXfuaOKdOKf9xYT0KKIGSJwFa
//  |  |  |                     |
//  |  |  |                     hash-value = K0kSxUFXfuaOKdOKf9xYT0KKIGSJwFa
//  |  |  |
//  |  |  salt = nOUIs5kJ7naTuTFkBy1veu
//  |  |
//  |  cost-factor = 10 = 2^10 iterations
//  |
//  hash-algorithm = 2y = BCrypt