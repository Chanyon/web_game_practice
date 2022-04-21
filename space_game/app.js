const canvas = document.querySelector("#myCanvas");
const ctx = canvas.getContext("2d");

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

let heroImg,enemyImg,laserImg,gameObjects = [],hero;

class GameObject {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dead = false;
    this.type = "";
    this.width = 0;
    this.height = 0;
    this.img = null;
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
  }
  draw(){
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
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
const Messages = {
  KEY_EVENT_UP: "KEY_EVENT_UP",
  KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
  KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
  KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",
};
const eventEmitter = new EventEmitter();

function initGame(){
  createEnemies();
  createHero();
  eventEmitter.on(Messages.KEY_EVENT_UP,()=>{
    hero.y -= 15;
  });
  eventEmitter.on(Messages.KEY_EVENT_DOWN,()=>{
    hero.y += 15;
  });
  eventEmitter.on(Messages.KEY_EVENT_LEFT,()=>{
    hero.x -= 15;
  });
  eventEmitter.on(Messages.KEY_EVENT_RIGHT,()=>{
    hero.x += 15;
  });
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
  }
});

window.onload = async function(){
  heroImg = await loadAsset("./assets/player.png")
  enemyImg = await loadAsset("./assets/enemyShip.png");
  laserImg = await loadAsset("./assets/player.png");
  initGame();
  let gameLoop = setInterval(()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    drawGameObjects();
  },100);
}
function drawGameObjects(){
  gameObjects.forEach(go => go.draw());
}



