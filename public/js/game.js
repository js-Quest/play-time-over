
window.addEventListener('load', function(){
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 750;
  canvas.height = 500;
  // classes for encapsulation and inheritance.  
  // !REFACTOR CLASSES LATER
  class Input{

  }
  class Fireball{

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
    }
    update(){

    }
    draw(context){
      // arguments: location and size measurements of player
      context.fillRect(this.x, this.y, this.width, this.height);
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
    
    }
    update(){
      this.player.update();
    }
    draw(context){
      this.player.draw(context);
    }

  }
  // make the game and animate it on a continuous loop 
  const game = new Game(canvas.width, canvas.height);
  function animate(){
    game.update();
    game.draw(ctx);
    // update animation before next refresh, loop.
    requestAnimationFrame(animate);
  }
  animate();
})