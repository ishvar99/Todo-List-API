var mongoose=require('mongoose');
var todoSchema=new mongoose.Schema({
	text:{
		type:String,
		required:true
	},
	isCompleted:{
		type:Boolean,
		default:false
	},
	completedAt:{
		type:Number,
        default:null
	}
});
module.exports=mongoose.model('todo',todoSchema);