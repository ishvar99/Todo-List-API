const express=require('express');
var helpers=require('../helpers/todos');
var router=express.Router();
router.route('/')
.get(helpers.getTodos)
.post(helpers.postTodo)
module.exports=router;
