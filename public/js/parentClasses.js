class Enemy {
  constructor(game) {
    this.game = game;
    this.x = this.game.width; //start from right side of screen
    this.y = 0;
    this.speedX = Math.random() * 4 - 2.5; //moves right to the left
    this.markedForDeletion = false;
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 37;
  }
  update() {
    // account for scrolling speed of background for enemy speed consideration
    this.x += this.speedX - this.game.speed;
    if (this.x + this.width < 0) this.markedForDeletion = true;
    // sprite animation
    if (this.frameX < this.maxFrame) {
      this.frameX++;
    } else this.frameX = 0;
  }
  draw(context) {
    // context.fillStyle = 'red'
    if (this.game.bug) { context.strokeRect(this.x, this.y, this.width, this.height) };
    context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    if (this.game.bug) {
      context.strokeStyle = 'black';
      context.font = '25px Arial';
      context.strokeText(this.lives, this.x, this.y);
    }
  }

}
class Explosion {
  constructor(game, x, y) {
    this.game = game;
    this.frameX = 0;
    this.spriteHeight = 200;
    this.spriteWidth = 200
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.x = x - this.width * 0.5;
    this.y = y - this.height * 0.5;
    this.fps = 25;
    this.timer = 0;
    this.interval = 1000 / this.fps;
    this.markedForDeletion = false;
    this.maxFrame = 8;
  }
  update(frameTime) {
    this.x -= this.game.speed;
    if (this.timer > this.interval) {
      this.frameX++;
    } else {
      this.timer += frameTime;
    }
    if (this.frameX > this.maxFrame) {
      this.markedForDeletion = true;
    }
  }
  draw(context) {
    context.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
  }
}