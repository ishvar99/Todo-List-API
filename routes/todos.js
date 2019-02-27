const express=require('express');
var helpers=require('../helpers/todos');
var router=express.Router();
router.route('/')
.get(helpers.getTodos)
.post(helpers.postTodo)
router.route('/:id')
.get(helpers.getTodo)
.put(helpers.updateTodo)
.delete(helpers.deleteTodo)
module.exports=router;
