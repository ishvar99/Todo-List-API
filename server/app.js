const express=require('express'),
      app=express(),
      bodyParser=require('body-parser'),
      todos=require('../routes/todos'),
      users=require('../routes/users'),
      db=require('../database/db');

app.use(bodyParser.urlencoded({extended:true}));
app.use('/todos',todos);
app.use('/users',users);
app.listen(3000,()=>{
	console.log('Server Started on Port 3000');
});