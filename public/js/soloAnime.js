const canvas3 = document.getElementById('soloAnime');
const ctx3 = canvas3.getContext('2d');
canvas3.width = 500;
canvas3.height = 500;

const CANVAS_WIDTH = canvas3.width;
const CANVAS_HEIGHT = canvas3.height;

const playerImage = new Image();
playerImage.src = "../assets/images/sprites/lucky.png";
let frameX3 = 0;
let frameY3 = 0;
const maxFrame3 = 38;
const spriteHeight3 = 95;
const spriteWidth3 = 99
let gameFrame3 = 0;


function animate3() {
  ctx3.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx3.drawImage(playerImage, frameX3 * spriteWidth3, frameY3 * spriteHeight3, spriteWidth3, spriteHeight3, 0, 0, 500, 500);
  if (frameX3 < 38) frameX3++;
  else frameX3 = 0;
  requestAnimationFrame(animate3);
}
animate3();