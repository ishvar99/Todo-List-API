var db=require('mongoose')
db.connect('mongodb://localhost/zextros',{ useNewUrlParser: true })
module.exports=db;