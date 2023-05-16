const { Highscore } = require('../../models');
// const { User } = require('../../models');
// const router = require('express').Router();

let playerScore = document.querySelector('#playerScore')  

setTimeout( async function(req,res,next){ 
    await sequelize.sync({ force: false });

    console.log('ThisWorks')

 await Highscore.create({
    score: playerScore.textContent,
    user_id: req.session.user_id,
})

console.log('ThisWorks3333')

next();
  
},10000);

// module.exports = router;