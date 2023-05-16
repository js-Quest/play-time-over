const router = require('express').Router();
const signupRoutes = require('./signupRoutes'); 
const loginRoutes = require('./loginRoutes'); 
const logoutRoutes = require('./logoutRoutes'); 

router.use('/signup', signupRoutes); 
router.use('/login', loginRoutes); 
router.use('/logout', logoutRoutes); 

module.exports = router;
