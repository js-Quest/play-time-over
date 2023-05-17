const router = require("express").Router();
const { Highscore, User } = require("../../models");


router.get("/", async (req, res) => {
  try { 

    const highscoreData = await Highscore.findOne({ where: { user_id: req.session.user_id} });
 
    const highscore = highscoreData.get({plain:true});  

    if (!highscoreData) {
      res.status(404).json({ message: "Category not found with this id!" });
      return;
    }

    res.status(200).json(highscore);
  } catch (err) {
    res.status(500).json(err); 
  }
});



router.post("/", async (req, res) => {
  try {

    console.log("aalsdfjl;asdkjlasdj INSIDE THE FUNCTION")

    console.log(req.body)


    const userData = await User.findOne({ where: { id: req.session.user_id} }); 

    const user = userData.get({plain:true}); 


    var temp = {
        score: req.body.score,
        user_id: user.id
    }

    const highscoreData = await Highscore.create(temp); 

    res.status(200).json(highscoreData);
  } catch (err) {
     
    res.status(400).json(err);
  }
});


router.put("/", async (req, res) => {
  
  try {
    const highscore = await Highscore.update(req.body, {
      where: {
        user_id: req.session.user_id,
      },

    }); 

    res.status(200).json({ message: "NEW SCORE ADDED!" });
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
