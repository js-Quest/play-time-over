
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
      // // fireballs
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

  }
  class BackgroundLayer{

  }
  class Background{

  }
  class UI{

  }
  class Game{
    // width and height of game matches size of canvas el
    constructor(width, height){
      this.width = width;
      this.height = height;
      this.player = new Player(this);
      this.input = new Input(this);
      this.keys = [];
      this.ammo = 25;
      this.maxAmmo =45
      this.ammoTimer = 0;
      // replenish one fireball every 500ms
      this.ammoInterval = 500;
    
    }
    update(changeTime){
      this.player.update();
      if (this.ammoTimer > this.ammoInterval){
        if (this.ammo < this.maxAmmo){
          this.ammo++;
        }else{
          this.ammoTimer =+ changeTime;
        }
      }
    }
    draw(context){
      this.player.draw(context);
    }

  }
  // make the game and animate it on a continuous loop 
  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;
  function animate(timeStamp){
    // use built-in timestamps from requestAnimationFrame
    // to find the change in time between animation loops
    const changeTime = timeStamp - lastTime
    // reset time for next changeTime calculation
    lastTime= timeStamp
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update();
    game.draw(ctx);
    // update animation before next refresh, loop.
    requestAnimationFrame(animate);
  }
  animate();
})