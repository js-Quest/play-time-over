const router = require("express").Router();
const { Highscore } = require("../../models");


router.get("/", async (req, res) => {
  try {
    const userData = await Highscore.findOne({ where: { user_id: req.session.user_id} });
 
    const user = userData.get({plain:true}); 

    if (!userData) {
      res.status(404).json({ message: "Category not found with this id!" });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500);
    return
  }
});



router.post("/", async (req, res) => {
  try {

    const userData = await Highscore.findOne({ where: { user_id: req.session.user_id} });

    console.log(userData)
    const user = userData.get({plain:true});
    console.log(user)


    var temp = {
        score: req.body.score,
        user_id: req.session.user_id
    }

    const highscoreData = await Highscore.create(temp); 

    res.status(200).json(highscoreData);
  } catch (err) {
     
    res.status(400).json(err);
  }
});

router.put("/", async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const highscore = await Highscore.update(req.body, {
      where: {
        user_id: req.session.user_id,
      },
    }); 
    
    res.status(200).json({ message: "Your tag has been updated!" });
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
