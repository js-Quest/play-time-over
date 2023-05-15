
window.addEventListener('load', function(){
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 750;
  canvas.height = 500;
  // classes for encapsulation and inheritance.  
  // !REFACTOR CLASSES LATER
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
        }
        console.log(this.game.keys)
      });
      // one key in array at a time
      window.addEventListener('keyup', event => {
        if (this.game.keys.indexOf(event.key) > -1){
          this.game.keys.splice(this.game.keys.indexOf(event.key), 1)
        }
        console.log(this.game.keys)
      })
    }

  }
  class Fireball{
    constructor(game, x, y) {
      this.game = game;
      this.x = x;
      this.y = y;
      this.width = 10;
      this.height = 4;
      this.speed = 4;
      this.markedForDeletion = false;

    }
    update(){
      this.x += this.speed
      if (this.x > this.game.width * 0.9){
        this.markedForDeletion = true;
      }
    }
    draw(context){
      context.fillStyle = 'white';
      context.fillRect(this.x, this.y, this.width, this.height);

    }
  }
  class Gear{

  }
  class Player{
    // game as argument to give access to properties of Game class
    constructor(game){
      this.game = game;
      this.width= 120;
      this.height = 190;
      // player starting position
      this.x = 20;
      this.y = 100;
      // player starting speed
      this.speedY = 0;
      this.maxSpeed = 2.5;
      this.fireballs = [];
    }
    update(){
      if (this.game.keys.includes('ArrowUp')) this.speedY = -this.maxSpeed;
      else if (this.game.keys.includes('ArrowDown')) this.speedY = this.maxSpeed;
      else this.speedY = 0; 
      this.y += this.speedY;
      // fireballs
      this.fireballs.forEach(fireball => {
        fireball.update();
      });
      this.fireballs = this.fireballs.filter(fireball => !fireball.markedForDeletion);
    }
    draw(context){
      // arguments: location and size measurements of player
      context.fillStyle = 'blue';
      context.fillRect(this.x, this.y, this.width, this.height);
      this.fireballs.forEach(fireball => {
        fireball.draw(context);
      });
    }
    upperShot(){
      if (this.game.ammo > 0) {
        // !need to position the shot origin location
        this.fireballs.push(new Fireball(this.game, this.x, this.y));
        this.game.ammo--;
      }
    }
    
  }
  class Enemy{
    constructor(game){
      this.game = game;
      this.x = this.game.width; //start from right side of screen
      this.speedX = Math.random() * 4 - 2.5; //moves right to the left
      this.markedForDeletion = false;
      this.lives= 5;
      this.score = this.lives;
    }
    update(){
      this.x += this.speedX;
      // enemy goes off screen, delete it
      if (this.x + this.width < 0) this.markedForDeletion = true;
    }
    draw(context){
      context.fillStyle = 'red'
      context.fillRect(this.x, this.y, this.width, this.height);
      context.fillStyle = 'black';
      context.font = '20px Arial';
      context.fillText(this.lives, this.x, this.y);
    }

  }

  class Angler1 extends Enemy{
    constructor(game){
      super(game);
      // !make smaller enemies for now placeholders
      this.width = 228 * 0.2;
      this.height = 169 * 0.2;
      this.y = Math.random() * (this.game.height * 0.95 - this.height);
    
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
    }
  }
  class UI{
    constructor(game) {
      this.game = game;
      this.fontSize = 30;
      this.fontFamily = 'Arial';
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
      // ammo bar
      context.fillStyle = this.color;
      for (let i = 0; i < this.game.ammo; i++) {
        // left margin 20px, 5px spacing, i = ammo amount, 3px wide, 15px tall
        context.fillRect(20 + 5*i + 5, 50, 3, 15);
      }
      // game timer
      const formatTime = (this.game.gameTime * 0.001).toFixed(1);
      context.fillText(`Timer: ${formatTime}`, 20 ,100)

      // game over
      if (this.game.gameOver){
        context.textAlign='center';
        let messageTop;
        let messageBottom;
        if(this.game.score > this.game.winningScore){
          messageTop = 'You did it.'
          messageBottom = 'You beat an easy game.'
        }else{
          messageTop = 'Ya blew it!';
          messageBottom = 'Try again, looooserrrrr!';
        }
        context.font = `50px ${this.fontFamily}`
        // the message, x and y destination coordinates.  *0.5 centers it.
        context.fillText(messageTop, this.game.width*0.5, this.game.height*0.5 - 30)
        context.font = `25px ${this.fontFamily}`
        context.fillText(messageBottom, this.game.width*0.5, this.game.height*0.5 + 30)
        
        
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
      this.keys = [];
      this.enemies =[];
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.ammo = 25;
      this.maxAmmo =50
      this.ammoTimer = 0;
      // replenish one ammo every 500ms
      this.ammoInterval = 750;
      this.gameOver = false;
      this.score = 0;
      this.winningScore = 10;
      this.gameTime = 0;
      this.timeLimit = 20000;
      // backgroundLayer scroll speed
      this.speed = 1;
    
    }
    update(frameTime){
      if (!this.gameOver){this.gameTime += frameTime;}
      if (this.gameTime > this.timeLimit){this.gameOver = true;}
      this.background.update();
      this.background.layer4.update(); //update layer4 after player renders so player doesn't overlap
      this.player.update();
      if (this.ammoTimer > this.ammoInterval) {
        if (this.ammo < this.maxAmmo) this.ammo++;
        this.ammoTimer = 0;
      } else {
        this.ammoTimer += frameTime;
      }
      this.enemies.forEach(enemy => {
        enemy.update();
        if (this.checkCollision(this.player, enemy)){
          enemy.markedForDeletion = true;
        }
        this.player.fireballs.forEach(fireball => {
          if (this.checkCollision(fireball, enemy)) {
            enemy.lives--;
            fireball.markedForDeletion = true;
            if (enemy.lives <= 0){
              enemy.markedForDeletion = true;
              this.score += enemy.score;
              if (!this.gameOver){
                this.score += enemy.score;
              }
              if (this.score > this.winningScore){
                this.gameOver = true;
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
    draw(context){
      this.background.draw(context);
      this.player.draw(context);
      this.ui.draw(context);
      this.enemies.forEach(enemy => {
        enemy.draw(context);
      });
      this.background.layer4.draw(context); //will appear in front of all other game objects
    }
    addEnemy(){
      this.enemies.push(new Angler1(this))
      // console.log(this.enemies)
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
    game.update(frameTime);
    game.draw(ctx);
    // update animation before next refresh, loop.
    requestAnimationFrame(animate);
  }
  animate(0);
})