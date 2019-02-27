const express=require('express'),
      app=express(),
      bodyParser=require('body-parser'),
      todos=require('../routes/todos'),
      db=require('../database/db');
app.use(bodyParser.urlencoded({extended:true}));
app.use('/todos',todos);
app.listen(3000,()=>{
	console.log('Server Started on Port 3000');
});