const router = require("express").Router();
const { Highscore } = require("../../models");



router.post("/", async (req, res) => {
  try {

    const userData = await Highscore.findOne({ where: { user_id: req.session.user_id} });


    var temp = {
        score: req.body.score,
        user_id: req.session.user_id
    }

    const highscoreData = await Highscore.create(temp); 

    res.status(200).json(highscoreData);
  } catch (err) {
    console.log('thisworks')
    res.status(400).json(err);
  }
});

module.exports = router;
