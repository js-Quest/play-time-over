const { Highscore } = require('../../models');


 

  const seedDatabase = async () => {
    await Highscore.create(({
        score: 1000,
        user_id: 2,
      }))
    
    process.exit(0);
  };
  
  seedDatabase(); 