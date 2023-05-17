

const themeMusic = document.getElementById("level1");
themeMusic.volume = 0.3;
let isPlaying = false;

window.addEventListener('click', function () { //toggle music on and off by clicking
  if (isPlaying === false) {  // Use === instead of =
    isPlaying = true;
    themeMusic.play();
  } else {
    isPlaying = false;
    themeMusic.pause();
  }
});

const playerScores = [];

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 500;
window.addEventListener('load', function(){
  // classes for encapsulation and inheritance.  
  class Input{
    constructor(game){
      this.game = game;
      // movement up and down of player on key events
      window.addEventListener('keydown', event => {
        
        if (( (event.key === 'ArrowUp')  ||
              (event.key === 'ArrowDown') )
        && this.game.keys.indexOf(event.key) === -1){
          this.game.keys.push(event.key);
        } else if (event.key === ' ') {
          this.game.player.upperShot();
        } else if (event.key === 'd'){ //toggle hit boxes on and off
          this.game.bug = !this.game.bug;
        }
      });
      // one key in array at a time
      window.addEventListener('keyup', event => {
        if (this.game.keys.indexOf(event.key) > -1){
          this.game.keys.splice(this.game.keys.indexOf(event.key), 1)
        }
      })
    }

  }
  class Fireball{
    constructor(game, x, y) {
      this.game = game;
      this.x = x;
      this.y = y;
      this.width = 36.25;
      this.height = 20;
      this.speed = 3;
      this.markedForDeletion = false;
      this.image = document.getElementById('fireball');
      this.frameX = 0; //there is one row in this sprite sheet
      this.maxFrame = 3; //there are 4 frames in this sprite sheet
    }
    update(frameTime){
      this.x += this.speed //speed relative to position of origination
      if (this.frameX < this.maxFrame){
        this.frameX++;
      }else{
        this.frameX = 0;
      }
      if (this.x > this.game.width * 0.9){ //delete if at 90% of canvas width
        this.markedForDeletion = true;
      }
    }
    draw(context){ //draw animation for fireball
      context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }
  }
  class Gear{
    // special effects for gears falling out of enemies
    constructor(game, x, y){
      this.game = game;
      this.x = x;
      this.y = y;
      this.image = document.getElementById('gears');
      // grab random images from gears sprite sheet, 3x3 images (9 total)
      this.frameX = Math.floor(Math.random() * 3);
      this.frameY = Math.floor(Math.random() * 3);
      this.spriteSize = 50; //sprite individual size on sheet
      this.sizeModifier = (Math.random() * 0.5 + 0.5).toFixed(1); //random size mod
      this.size = this.spriteSize * this.sizeModifier; //now all gears sized differently at random
      this.speedX = Math.random() * 6 - 3; // random movement for gears, -3 to +3
      this.speedY = Math.random() * -15; //gears move up before going down
      this.gravity = 0.5; //gears fall downward
      this.markedForDeletion = false;
      this.angle = 0; //each gear starts at a 0 angle
      this.vAngle = Math.random() * 0.2 - 0.1; //then rotates -0.1 to +0.1 radians (velocity angle) per frame
      this.bounced = false;
      this.bottomBoundary = Math.random() * 80 + 60; // sets to between 60-140px for 3D-ish effect
    }
    update(){
      this.angle += this.vAngle;
      this.speedY += this.gravity;
      this.x -= this.speedX + this.game.speed; //account for background scrolling on x-axis speed
      this.y += this.speedY; //gives effect of falling down by gravity
      if (this.y > this.game.height + this.size || this.x < 0 - this.size){
       this.markedForDeletion = true; //delete when falls or scrolls off screen
      } 
      if (this.y > this.game.height - this.bottomBoundary && !this.bounced){
       this.bounced = true;
       this.speedY *= -0.5; //moves it upward after hitting boundary so 'bounces'
      }
    }
    draw(context){
      context.save() //anything between save/restore only affects code in between bc you call restore later.  Otherwise the whole canvas spins.
      context.translate(this.x, this.y); //need to specify where we want the rotating effect.
      context.rotate(this.angle)
      //9 args get one frame of the sprite sheet: image, source x y w h, destination x y w h.  
      context.drawImage(this.image, this.frameX * this.spriteSize, this.frameY * this.spriteSize, this.spriteSize, this.spriteSize, this.size * -0.5, this.size * -0.5, this.size, this.size); //destinations x and y are already specified in the context.translate; * -0.5 is to move the origination of the effect to the center of the enemy animation, otherwise it originates from the top left corner because that's canvas default.
      context.restore()
    }
  }
  class Player{
    // game as argument to give access to properties of Game class
    constructor(game){
      this.game = game;
      this.width= 120;
      this.height = 190;
      this.x = 20; // player starting position
      this.y = 100;
      this.frameX = 0; //cycle on sprite spreadsheet horizontally
      this.frameY = 0; //determines row of the sheet, 0 is the first row
      this.maxFrame = 37; //there are 38 instances per player image sprite sheet row
      this.speedY = 0; //player starting speed
      this.maxSpeed = 2.5;
      this.fireballs = [];
      this.image = document.getElementById('player');
      this.powerUp = false;
      this.powerUpTimer = 0;
      this.powerUpLimit = 10000;//10 seconds of powerup
    }
    update(frameTime){
      if (this.game.keys.includes('ArrowUp')) this.speedY = -this.maxSpeed;
      else if (this.game.keys.includes('ArrowDown')) this.speedY = this.maxSpeed;
      else this.speedY = 0; //speed control for key down events
      this.y += this.speedY;
      // vertical boundary so player doesn't disappear off screen, only half off screen
      if (this.y > this.game.height - this.height * 0.5) this.y = this.game.height - this.height * 0.5;
      else if (this.y < -this.height * 0.5) this.y = -this.height * 0.5;
      // fireballs
      this.fireballs.forEach(fireball => {
        fireball.update(frameTime);
      });
      this.fireballs = this.fireballs.filter(fireball => !fireball.markedForDeletion);
      // sprite animation
      if (this.frameX < this.maxFrame) {
        this.frameX++;
      } else {
        this.frameX = 0;
      }
      // powerup fishes!
      if (this.powerUp) {
        if (this.powerUpTimer > this.powerUpLimit) {
          this.powerUpTimer = 0;
          this.powerUp = false;
          this.frameY = 0;
          this.game.sound.powerDown();
        } else {
          this.powerUpTimer += frameTime;
          this.frameY = 1; //the second row of the player sprite sheet
          this.game.ammo += 0.1; //bonus ammo replenishment
        }
      }
    }
    draw(context){
      // arguments: location and size measurements of player
      context.fillStyle = 'black';
      if (this.game.bug) {context.strokeRect(this.x, this.y, this.width, this.height)};
      this.fireballs.forEach(fireball => {
        fireball.draw(context);
      });
      //9 arguments: this image, source x, source y, source width, source height, destinations(this) x y w h to specify where we want the cropped image on the canvas
      context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }
    upperShot(){
      if (this.game.ammo > 0) {
        // !need to position the shot origin location
        this.fireballs.push(new Fireball(this.game, this.x +80, this.y +30));
        this.game.ammo--;
      }
      this.game.sound.shot();
      if(this.powerUp){ this.lowerShot()};
    }
    lowerShot(){
      if (this.game.ammo > 0) {
        // !need to position the shot origin location
        this.fireballs.push(new Fireball(this.game, this.x +85, this.y +170));
        this.game.ammo--;
      }
    }
    goPowerUp(){
      this.powerUpTimer = 0; // you can reset timer by getting more powerups
      this.powerUp = true;
      if (this.game.ammo < this.game.maxAmmo){
        this.game.ammo = this.game.maxAmmo;
      };
      this.game.sound.powerUp();
    }   
  }
  
  class Angler1 extends Enemy{
    constructor(game){
      super(game);
      this.width = 228;
      this.height = 169;
      this.y = Math.random() * (this.game.height * 0.95 - this.height);//random spawn 95% screen height
      this.image = document.getElementById('angler1');
      this.frameY = Math.floor(Math.random() * 3); //three animations that loop on sheet, random pick one
      this.lives = 4;
      this.score = this.lives;
    }
  }
  class Angler2 extends Enemy{
    constructor(game){
      super(game);
      this.width = 213;
      this.height = 165;
      
      this.image = document.getElementById('angler2');
      this.frameY = Math.floor(Math.random() * 2); //two animations that loop on sheet, random pick one
      this.lives = 5;
      this.score = this.lives;
    }
  }
  class Lucky extends Enemy {
    constructor(game) {
      super(game);
      this.width = 99;
      this.height = 95;
      this.y = Math.random() * (this.game.height * 0.95 - this.height);
      this.image = document.getElementById('lucky');
      this.frameY = Math.floor(Math.random() * 2); //two animations that loop on sheet, random pick one
      this.lives = 3;
      this.score = 7;
      this.type = 'lucky';
    }
  }
  class HiveWhale extends Enemy {
    constructor(game) {
      super(game);
      this.width = 400;
      this.height = 227;
      this.y = Math.random() * (this.game.height * 0.95 - this.height);
      this.image = document.getElementById('hivewhale');
      this.frameY = 0; // 0 bc only one row on the sprite sheet
      this.lives = 18;
      this.score = this.lives;
      this.type = 'hive';
      this.speedX = Math.random() * -1.3 - 0.4; //moves slow
    }
  }
  class BulbWhale extends Enemy {
    constructor(game) {
      super(game);
      this.width = 270;
      this.height = 219;
      this.y = Math.random() * (this.game.height * 0.95 - this.height);
      this.image = document.getElementById('bulbwhale');
      this.frameY = Math.floor(Math.random() * 2);
      this.lives = 18;
      this.score = this.lives;
      this.speedX = Math.random() * -1.2 - 2
    }
  }
  class MoonFish extends Enemy {
    constructor(game) {
      super(game);
      this.width = 227;
      this.height = 240;
      this.y = Math.random() * (this.game.height * 0.95 - this.height);
      this.image = document.getElementById('moonfish');
      this.frameY = 0;
      this.lives = 12;
      this.score = this.lives;
      this.speedX = Math.random() * -1.2 - 2 // 2 to 3.2 px per frame
      this.type = 'moon';
    }
  }
  class Drone extends Enemy {
    constructor(game, x, y) { //only seen when hivewhale destroyed
      super(game);
      this.width = 115;
      this.height = 95;
      this.x = x;
      this.y = y;
      this.image = document.getElementById('drone');
      this.frameY = Math.floor(Math.random() * 2); //row 0 or row 1
      this.lives = 2;
      this.score = this.lives;
      this.type = 'drone';
      this.speedX = Math.random() * -4.2 - 0.5 //can move faster, 0.5-4.7px per frame
    }
  }
  class BackgroundLayer{  //handle logic for layers
    constructor(game, image, speedModifier){
      this.game = game;
      this.image = image;
      this.speedModifier = speedModifier;
      this.width = 1767;
      this.height = 500;
      this.x = 0;
      this.y = 0;
    }
    update() {
      // scrolling layers and reset to scroll again
      if (this.x <= -this.width){
        this.x = 0;
      }
      this.x -= this.game.speed * this.speedModifier;
    }
    draw(context) {
      // arguments: image and destination
      context.drawImage(this.image, this.x, this.y)
     // parallax background, seamless scrolling 
      context.drawImage(this.image, this.x + this.width, this.y)
    }

  }
  class Background{ //handle layers 
    constructor(game){
      this.game = game;
      this.image1 = document.getElementById('layer1');
      this.image2 = document.getElementById('layer2');
      this.image3 = document.getElementById('layer3');
      this.image4 = document.getElementById('layer4');
      this.layer1 = new BackgroundLayer(this.game, this.image1, 0.2);
      this.layer2 = new BackgroundLayer(this.game, this.image2, 0.4);
      this.layer3 = new BackgroundLayer(this.game, this.image3, 1);
      this.layer4 = new BackgroundLayer(this.game, this.image4, 1.5);
      this.layers = [this.layer1, this.layer2, this.layer3]
    } 
    update(){
      this.layers.forEach(layer => layer.update());
    }
    draw(context){
      this.layers.forEach(layer => layer.draw(context));
    } //layer 4 added later in the game class draw method so it appears in front
  }

  class SmokeExplosion extends Explosion {
    constructor(game, x, y){
      super(game, x, y);
      this.image = document.getElementById('smokeExplosion');
    }

  }
  class FireExplosion extends Explosion {
    constructor(game, x, y) {
      super(game, x, y);
      this.image = document.getElementById('fireExplosion');

    }
  }
  class SoundEffects {
    constructor(){
      this.powerUpSound = document.getElementById('powerup');
      this.powerDownSound = document.getElementById('powerdown');
      this.hitSound = document.getElementById('hit');
      this.explosionSound = document.getElementById('explosion');
      this.shieldSound = document.getElementById('shieldSound');
      this.shotSound = document.getElementById('shot');
    }
    powerUp(){
      this.powerUpSound.currentTime = 0; //play same file again if method is called, using the built in currentTime media property
      this.powerUpSound.play();
    }
    powerDown(){
      this.powerDownSound.currentTime = 0;
      this.powerDownSound.play();
    }
    hit(){
      this.hitSound.currentTime = 0;
      this.hitSound.play();
    }
    explosion(){
      this.explosionSound.currentTime = 0;
      this.explosionSound.play();
    }
    shield(){
      this.shieldSound.currentTime = 0;
      this.shieldSound.play();
    }
    shot(){
      this.shotSound.currentTime = 0;
      this.shotSound.play();
    } 
  }
  class Shield {
    constructor(game) {
      this.game = game;
      this.width = this.game.player.width;
      this.height = this.game.player.height;
      this.frameX = 0;
      this.maxFrame = 24;
      this.image = document.getElementById('shield');
      this.fps = 30;
      this.timer = 0;
      this.interval = 1000 / this.fps;
    }
    update(frameTime) {
      if (this.frameX <= this.maxFrame) {
        if (this.timer > this.interval) {
          this.frameX++;
          this.timer = 0;
        } else {
          this.timer = + frameTime;
        }
        this.frameX++;
      };
    }
    draw(context) {
      context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.game.player.x, this.game.player.y, this.width, this.height);
    };
    reset() {
      this.frameX = 0;
      this.game.sound.shield();
    }
  }
  class UI{
    constructor(game) {
      this.game = game;
      this.fontSize = 30;
      this.fontFamily = 'Bangers';
      this.color = 'white';
    }
    draw(context){
      context.save(); //save and restore states of canvas
      // score
      context.fillStyle = this.color;
      context.shadowOffsetX=2;
      context.shadowOffsetY=2;
      context.shadowColor='black';
      
      context.font = `${this.fontSize}px ${this.fontFamily}`
      context.fillText(`Score: ${this.game.score}`, 20, 40)
      
      // game timer
      const formatTime = (this.game.gameTime * 0.001).toFixed(1);
      context.fillText(`Timer: ${formatTime}`, 20 ,100)

      // game over
      if (this.game.gameOver){
        // console.log(this.game.score)
        let h1Score = document.getElementById('playerScore');
        let finalScore = this.game.score;
        // playerScores.length = 1;
        // playerScores.push(finalScore);
        //   const result = playerScores.slice(-1);
          // console.log(result);
        h1Score.innerHTML = `${finalScore}`;
        context.textAlign='center';
        let messageTop;
        let messageBottom;
        if(this.game.score > this.game.winningScore){
          messageTop = 'You did it.'
          messageBottom = 'You beat an easy game.'
          // playerScores.push(finalScore);
          // console.log(playerScores);
        }else{
          messageTop = 'Ya blew it!';
          messageBottom = 'Try again, looooserrrrr!';
          // playerScores.push(finalScore);
          // console.log(playerScores);
        }
        context.font = `100px ${this.fontFamily}`
        // the message, x and y destination coordinates.  *0.5 centers it.
        context.fillText(messageTop, this.game.width*0.5, this.game.height*0.5 - 30)
        context.font = `50px ${this.fontFamily}`
        context.fillText(messageBottom, this.game.width*0.5, this.game.height*0.5 + 50)       
      }
      // ammo bar
      if (this.game.player.powerUp) context.fillStyle = '#ffffbd';
      context.fillStyle = this.color;
      for (let i = 0; i < this.game.ammo; i++) {
        // left margin 20px, 5px spacing, i = ammo amount, 3px wide, 15px tall
        context.fillRect(20 + 5 * i + 5, 50, 3, 15);
      }
      context.restore();
    }
  }
  class Game{
    // width and height of game matches size of canvas el
    constructor(width, height){
      this.width = width;
      this.height = height;
      this.player = new Player(this);
      this.input = new Input(this);
      this.ui = new UI(this);
      this.background = new Background(this);
      this.shield = new Shield(this);
      this.sound = new SoundEffects();
      this.keys = [];
      this.enemies = [];
      this.explosions = [];
      this.gears = [];
      this.enemyTimer = 0;
      this.enemyInterval = 1500;
      this.ammo = 25;
      this.maxAmmo =50
      this.ammoTimer = 0;
      // replenish one ammo every 500ms
      this.ammoInterval = 400;
      this.gameOver = false;
      this.score = 0;
      this.winningScore = 75;
      this.gameTime = 0;
      this.timeLimit = 9000;
      // backgroundLayer scroll speed
      this.speed = 1;
      this.bug = false;
    
    }
    update(frameTime){
      if (!this.gameOver){this.gameTime += frameTime;}
      if (this.gameTime > this.timeLimit){this.gameOver = true};
      this.background.update();
      this.background.layer4.update(); //update layer4 after player renders so player doesn't overlap
      this.player.update(frameTime);
      if (this.ammoTimer > this.ammoInterval) {
        if (this.ammo < this.maxAmmo) this.ammo++; //ammo recharge on a timer
        this.ammoTimer = 0; //restart timer
      } else {
        this.ammoTimer += frameTime;
      }
      this.shield.update(frameTime);
      this.gears.forEach(gear => gear.update());
      this.gears = this.gears.filter(gear => !gear.markedForDeletion);
      this.explosions.forEach(explosion => explosion.update(frameTime));
      this.explosions = this.explosions.filter(explosion => !explosion.markedForDeletion);
      this.enemies.forEach(enemy => {
        enemy.update();
        if (this.checkCollision(this.player, enemy)){
          enemy.markedForDeletion = true;
          this.addExplosion(enemy);
          this.sound.hit();
          this.shield.reset();
          // this.addExplosion(enemy);
          for (let i = 0; i < enemy.score; i++) { // # of gears falling depend on strength of enemy
            this.gears.push(new Gear(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5)); //gears originate from center of enemy sprite
          }
          if (enemy.type === 'lucky'){
            this.player.goPowerUp(); //powerup if collide with lucky type
          }else if (!this.gameOver){
            this.score--; //lose a point for collision with non-lucky enemies
          }
        }
        this.player.fireballs.forEach(fireball => {
          if (this.checkCollision(fireball, enemy)) {
            enemy.lives--; // enemy loses 1 life point every time hit by fireball
            fireball.markedForDeletion = true; //delete fireball after collision
            this.gears.push(new Gear(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5)); //gears originate from center of enemy sprite 
            if (enemy.lives <= 0){
              // # of gears falling depend on strength of enemy
              for (let i = 0; i < enemy.score; i++) {
                this.gears.push(new Gear(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
              }
              enemy.markedForDeletion = true;
              this.addExplosion(enemy);
              this.sound.explosion();
              this.score += enemy.score;
              if (enemy.type === 'hive'){
                for (let i = 0; i <5; i++){
                  this.enemies.push(new Drone(this, enemy.x + Math.random() * enemy.width, enemy.y + Math.random() * enemy.height * 0.5)); //random spawn within whale coords
                }
              }
              if (enemy.type === 'moon'){
                this.player.goPowerUp(); //powerup if you destroy a moonfish
              }
              if (!this.gameOver){
                this.score += enemy.score;
              }
            }
          }
        })
      });
      this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
      if (this.enemyTimer > this.enemyInterval && !this.gameOver){
        this.addEnemy();
        this.enemyTimer = 0;
      }else{
        this.enemyTimer += frameTime;
      }
    }
    draw(context){ //stuff gets drawn in order top to bottom
      this.background.draw(context);
      this.ui.draw(context);
      this.player.draw(context);
      this.shield.draw(context);
      this.gears.forEach(gear => gear.draw(context));
      // console.log(this.gears)
      this.enemies.forEach(enemy => {
        enemy.draw(context);
      });
      this.explosions.forEach(explosion => {
        explosion.draw(context);
      });
      this.background.layer4.draw(context); //will appear in front of all other game objects
    }
    addEnemy(){
      const randomize = Math.random();
      if (randomize < 0.3) this.enemies.push(new Angler1(this))
      else if (randomize < 0.6) this.enemies.push(new Angler2(this));
      else if (randomize < 0.7) this.enemies.push(new BulbWhale(this));
      else if (randomize < 0.8) this.enemies.push(new HiveWhale(this));
      else if (randomize < 0.9) this.enemies.push(new MoonFish(this));
      else {this.enemies.push(new Lucky(this))};
    }
    addExplosion(enemy){
      const randomize = Math.random();
      if (randomize < 0.5){
        this.explosions.push(new SmokeExplosion(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5))
      }else{
        this.explosions.push(new FireExplosion(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5))
      }  
    }
  // check collision of rectangles(sprite animation hit boxes)
    checkCollision(rect1,rect2){
      // is rect1Xposition less than rect2X plus its width
      return (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y
      )
    }
  }
  // make the game and animate it on a continuous loop 
  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;
  function animate(timeStamp){
    // use built-in timestamps from requestAnimationFrame
    // to find the change in time between animation loops
    // my pc runs 60fps for this game (1000/16.6)
    const frameTime = timeStamp - lastTime
    // reset time for next frameTime calculation
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.draw(ctx);
    // update animation before next refresh, loop.
    game.update(frameTime);
    requestAnimationFrame(animate);
  }
  animate(0);
  // get score outside of animation loop so local storage doesn't get overran with a million scores
  // you get the one score.
  setTimeout(function () {
    let highScores = JSON.parse(window.localStorage.getItem("highScores")) || [];
    var newScore = {
      score: game.score,
    }
    // Saves score to local storage
    highScores.push(newScore);
    window.localStorage.setItem("highScores", JSON.stringify(highScores));
  }, 9050);
})








