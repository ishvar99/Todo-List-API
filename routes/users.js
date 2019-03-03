const express=require('express');
const authenticate=require('../middleware/authenticate.js')
const helpers=require('../helpers/users')
var router=express.Router();
router.post('/signup',helpers.addUser)
router.post('/login',helpers.verifyUser)
router.get('/',authenticate,helpers.getUser)
router.delete('/logout',authenticate,helpers.removeUser)
module.exports=router;
