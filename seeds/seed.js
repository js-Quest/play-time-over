const sequelize = require('../config/connection');
const { User, Highscore} = require('../models');

const userData = require('./user-Data.json');
const highscoreData = require('./highscoreData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  for (const highscore of highscoreData) {
    await Highscore.create({
      ...highscore,
      user_id: users[Math.floor(Math.random() * users.length)].id,
    });
  }
 
  process.exit(0);
};

seedDatabase();

