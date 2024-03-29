// 教程地址
// https://microsoft.github.io/Web-Dev-For-Beginners/
const canvas = document.querySelector("#myCanvas");
const ctx = canvas.getContext("2d");

// 创建Image
function loadAsset(path) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      resolve(img);
    }
    img.onerror = () => reject(new Error("do not load'"));
  })
}

let heroImg,enemyImg,laserImg,lifeImg,gameObjects = [],hero,laser,gameLoop;

class GameObject {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dead = false; //控制死亡
    this.type = "";
    this.width = 0;
    this.height = 0;
    this.img = null;
  }
  // 返回位置
  rectFromObject(){
    return {
      left: this.x,
      top: this.y, 
      bottom:this.y + this.height,
      right:this.x + this.width
    }
  }
}

class Hero extends GameObject {
  constructor(x, y,img) {
    super(x, y);
    this.width = 98;
    this.height = 50;
    this.type = "Hero",
    this.speed = 1;
    this.img = img;
    this.coolDown = 0;
    this.life = 3;
    this.points = 0;
  }
  draw(){
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
  fire(){
    gameObjects.push(new Laser(this.x + 45,this.y-10,laserImg));
    this.coolDown = 500;
    let id = setInterval(()=>{
      if(this.coolDown > 0){
        this.coolDown -= 100;
      }else{
        clearInterval(id);
      }
    },200)
  }
  canFire(){
    return this.coolDown === 0;
  }
  decrementLife(){
    this.life -= 1;
    if(this.life === 0){
      this.dead = true;
    }
  }
  incrementPoints(){
    this.points += 100;
  }
}
class Enemy extends GameObject {
  constructor(x, y, img) {
    super(x, y);
    this.width = 98;
    this.height = 50;
    this.type = "Enemy";
    this.img = img;
    let id = setInterval(()=>{
      if(this.y < canvas.height - this.height){
        this.y += 5;
      }else{
        clearInterval(id);
      }
    },300);
  }
  draw(){
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}
class Laser extends GameObject {
  constructor(x, y, img) {
    super(x, y);
    this.width = 9;
    this.height = 33;
    this.type = "Laser";
    this.img = img;
    this.dead = false;
    let id = setInterval(()=>{
      if(this.y >= 0){
        this.y -= 15;
      }else{
        this.dead = true;
        clearInterval(id);
      }
    },100);
  }
  draw(){
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}

function createHero(){
  hero = new Hero(canvas.width / 2 - 45,canvas.height - canvas.height/4,heroImg);
  gameObjects.push(hero);
}
function createEnemies(){
  const MONSTER_TOTAL = 5; //敌人数量？
  const MONSTER_WIDTH = MONSTER_TOTAL * 98;
  const START_X = (canvas.width - MONSTER_WIDTH) / 2;
  const STOP_X = START_X + MONSTER_WIDTH;
  for (let x = START_X; x <= STOP_X; x += 110) {
    for (let y = 0; y < 5 * 50; y += 50) {
      const enemy = new Enemy(x,y,enemyImg);
      gameObjects.push(enemy);
    }
  }
}
function drawLife(){
  const START_POS = canvas.width - 180;
  for (let i = 0; i < hero.life;i++){
    ctx.drawImage(lifeImg,START_POS + 45*i+1,canvas.height-37);
  }
}
function drawPoints(){
  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "left";
  drawText(`Points:${hero.points}`,10,canvas.height-20);
}

function drawText(message,x,y){
  ctx.fillText(message,x,y);
}

// function createLaser(){
//   laser = new Laser(canvas.width / 2 - 4,canvas.height - canvas.height/4-50,laserImg);
//   gameObjects.push(laser);
// }

// PUB/SUB
class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  on(message, listener) {
    if (!this.listeners[message]) {
      this.listeners[message] = [];
    }
    this.listeners[message].push(listener);
  }

  emit(message, payload = null) {
    if (this.listeners[message]) {
      this.listeners[message].forEach((l) => l(message, payload));
    }
  }
  clear(){
    this.listeners = {};
  }
}


const Messages = {
  KEY_EVENT_UP: "KEY_EVENT_UP",
  KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
  KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
  KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",
  KEY_EVENT_SPACE: "KEy_EVENT_SPACE",
  COLLISION_ENEMY_LASER: "COLLISION_ENEMY_LASER",
  COLLISION_ENEMY_HERO: "COLLISION_ENEMY_HERO",
  GAME_END_WIN: "GAME_END_WIN",
  GAME_END_LOSS: "GAME_END_LOSS",
  KEY_EVENT_ENTER: "KEY_EVENT_ENTER",
};
const eventEmitter = new EventEmitter();

// 游戏初始化
function initGame(){
  createEnemies();
  createHero();
  // 事件监听
  eventEmitter.on(Messages.KEY_EVENT_UP,()=>{
    hero.y -= 30;
  });
  eventEmitter.on(Messages.KEY_EVENT_DOWN,()=>{
    hero.y += 30;
  });
  eventEmitter.on(Messages.KEY_EVENT_LEFT,()=>{
    hero.x -= 30;
  });
  eventEmitter.on(Messages.KEY_EVENT_RIGHT,()=>{
    hero.x += 30;
  });
  eventEmitter.on(Messages.KEY_EVENT_SPACE,()=>{
    // 创建激光武器
    if(hero.canFire()){
      hero.fire();
    }
  });
  eventEmitter.on(Messages.COLLISION_ENEMY_LASER,(_,{first,second})=>{
    // 控制敌人消失
    first.dead = true;
    second.dead = true;
    hero.incrementPoints();
    if(isEnemyDead()){
      eventEmitter.emit(Messages.GAME_END_WIN);
    }
  });
  eventEmitter.on(Messages.COLLISION_ENEMY_HERO,(_,{enemy})=>{
    enemy.dead = true;
    hero.decrementLife();
    if(isHeroDead()){
      eventEmitter.emit(Messages.GAME_END_LOSS);
      return;
    }
    if(isEnemyDead()){
      hero.dead = true;
      eventEmitter.emit(Messages.GAME_END_WIN);
    }
  });

  eventEmitter.on(Messages.GAME_END_WIN,()=>{
    endGame(true);
  });
  eventEmitter.on(Messages.GAME_END_LOSS,()=>{
    endGame(false);
  });
  eventEmitter.on(Messages.KEY_EVENT_ENTER,()=>{
    if(isHeroDead() || isEnemyDead()){
      resetGame();
    }
  })
}

// 比较函数
function intersectRect(r1,r2){
  return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
}

// 处理碰撞检测
function updateGameObjects(){
  const enemies = gameObjects.filter(go => go.type === "Enemy");
  const lasers = gameObjects.filter(go => go.type === "Laser");
  lasers.forEach(l =>{
    enemies.forEach(m =>{
      if(intersectRect(l.rectFromObject(),m.rectFromObject())){
        // 发射事件
        eventEmitter.emit(Messages.COLLISION_ENEMY_LASER,{
          first:l,
          second:m,
        });
      }
    });
    enemies.forEach(enemy => {
      const heroRect = hero.rectFromObject();
      if(intersectRect(heroRect,enemy.rectFromObject())){
        eventEmitter.emit(Messages.COLLISION_ENEMY_HERO,{enemy});
      }
    })
  })
  gameObjects = gameObjects.filter(go => !go.dead);
}
function isHeroDead(){
  return hero.life <= 0;
}
function isEnemyDead(){
  const enemies = gameObjects.filter(go => go.type === "Enemy" && !go.dead);
  return enemies.length === 0;
}

// 显示获胜条件
function displayMessage(message,color ="red"){
  ctx.font = "30px Arial";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.fillText(message,canvas.width / 2,canvas.height / 2);
}

function endGame(win){
  clearInterval(gameLoop);
  setTimeout(() =>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    if(win){
      displayMessage("Victory!!! Pew Pew... - Press [Enter] to start a new game Captain Pew Pew",
      "green");
    }else{
      displayMessage("You died !!! Press [Enter] to start a new game Captain Pew Pew",color ="red");
    }
  },200);
}
// 重启游戏
function resetGame(){
  if(gameLoop){
    clearInterval(gameLoop);
    eventEmitter.clear();
    initGame();
    gameLoop = setInterval(()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = "black";
      ctx.fillRect(0,0,canvas.width,canvas.height);
      drawPoints();
      drawLife();
      updateGameObjects();
      drawGameObjects();
    },100);
  }
}

window.addEventListener("keydown",(e)=>{
  if(e.key === "ArrowUp"){
    eventEmitter.emit(Messages.KEY_EVENT_UP);
  }else if(e.key === "ArrowDown"){
    eventEmitter.emit(Messages.KEY_EVENT_DOWN);
  }else if(e.key === "ArrowLeft"){
    eventEmitter.emit(Messages.KEY_EVENT_LEFT);
  }else if(e.key === "ArrowRight"){
    eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
  }else if(e.keyCode === 32){
    eventEmitter.emit(Messages.KEY_EVENT_SPACE);
  }else if(e.key === "Enter"){
    eventEmitter.emit(Messages.KEY_EVENT_ENTER);
  }
});

window.onload = async function(){
  heroImg = await loadAsset("./assets/player.png")
  enemyImg = await loadAsset("./assets/enemyShip.png");
  laserImg = await loadAsset("./assets/player.png");
  lifeImg = await loadAsset("./assets/player.png");
  initGame();
  gameLoop = setInterval(()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    drawGameObjects();
    updateGameObjects();
    drawLife();
    drawPoints();
  },100);
}
function drawGameObjects(){
  gameObjects.forEach(go => go.draw());
}



