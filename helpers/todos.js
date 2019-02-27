var Todo=require('../models/todos');
exports.getTodos=function(req,res){
  Todo.find()
  .then((todos)=>{
       res.json(todos);
  },(e)=>{
  	console.log(e);
  })

}
exports.postTodo=function(req,res){
	var body=req.body;
	Todo.create(body)
	.then((todo)=>{
		res.json(todo);
	})
	.catch((error)=>{
        console.log(error);
	})
}
module.exports=exports;