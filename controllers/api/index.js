const router = require('express').Router();
const signupRoutes = require('./signupRoutes'); 
const loginRoutes = require('./loginRoutes'); 

router.use('/signup', signupRoutes); 
router.use('/login', loginRoutes); 

module.exports = router;
