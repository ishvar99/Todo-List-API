const express=require('express');
const authenticate=require('../middleware/authenticate.js')
const helpers=require('../helpers/users')
var router=express.Router();
router.route('/signup')
.post(helpers.addUser)
router.route('/login',authenticate)
.post(helpers.verifyUser)
module.exports=router;