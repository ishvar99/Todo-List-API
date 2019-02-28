var Todo=require('../models/todos');
var {ObjectId} = require('mongoose').Types;
const _=require('lodash');

exports.getTodos=function(req,res){
  Todo.find()
  .then((todos)=>{
       res.json(todos);
  },(e)=>{
  	console.log(e);
  })
}
exports.postTodo=function(req,res){
	var body=_.pick(req.body,['text'])
	Todo.create(body)
	.then((todo)=>{
		res.json(todo);
	})
	.catch((error)=>{
        console.log(error);
	})
}
exports.getTodo=function(req,res){
	var id=req.params.id;
	if(!ObjectId.isValid(id)){
		return res.status(400).send('Bad Request!')
	}
	Todo.findOne({_id:id})
	.then((todo)=>{
		if(!todo)
			throw new Error('Todo not found!')
		res.json(todo);
	})
	.catch((error)=>{
		res.status(404).send(error.message)
	})
}
exports.updateTodo=function(req,res){
	 var id=req.params.id;
	 if(!ObjectId.isValid(id))
	 	return res.status(400).send('Bad Request!');
	 var body=_.pick(req.body,['text','isCompleted']);
	 body.completedAt=null;
	 if(!body.isCompleted)
	 	    body.isCompleted=false;
	 if(body.isCompleted=='true')
            body.completedAt=new Date().getTime();
	 Todo.findOneAndUpdate({_id:id},body,{new:true})
	 .then((updatedTodo)=>{
	 	res.json(updatedTodo);
	 })
	 .catch((error)=>{
           res.status(404).send(error.message);
	 })
	}
exports.deleteTodo=function(req,res){
	var id=req.params.id;
	if(!ObjectId.isValid(id))
		return res.status(400).send('Bad Request')
	Todo.findOneAndRemove({_id:id})
	.then((deletedTodo)=>{
		if(!deletedTodo)
			throw new Error('Todo not found!')
		res.redirect('/todos');
	})
	.catch((error)=>{
		res.status(404).send(error.message)
	})
}
module.exports=exports;