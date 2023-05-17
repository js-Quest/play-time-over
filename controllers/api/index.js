const router = require('express').Router();
const signupRoutes = require('./signupRoutes'); 
const loginRoutes = require('./loginRoutes'); 
const logoutRoutes = require('./logoutRoutes'); 
const highscoreRoutes = require('./highscoreRoutes'); 

router.use('/signup', signupRoutes); 
router.use('/login', loginRoutes); 
router.use('/logout', logoutRoutes); 
router.use('/highscore', highscoreRoutes);

module.exports = router;
