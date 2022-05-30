'use strict';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width,height = canvas.height;

let time_id = null;
let everything = [];

let start_rock_x = 100,start_rock_y =240;
let ball_x = start_rock_x,ball_y = start_rock_y;
let ball_radius = 10;

let in_motion = false;

let vertical_vel1,vertical_vel2,hor_velocity;
let gravity = 2;

let chicken = "https://tse1-mm.cn.bing.net/th/id/OIP-C.1YraCHatX5XIxsyXMuZ3zAHaJ8?w=137&h=184&c=7&r=0&o=5&dpr=2&pid=1.7";
let feathers = "https://tse4-mm.cn.bing.net/th/id/OIP-C.LBh5KR0vQOUwNcrpsPXScQHaHa?w=190&h=190&c=7&r=0&o=5&dpr=2&pid=1.7";

class Sling {
  constructor(bx,by,s1x,s1y,s2x,s2y,s3x,s3y,style){
    this.bx = bx;
    this.by = by;
    this.s1x = s1x;
    this.s1y = s1y;
    this.s2x = s2x;
    this.s2y = s2y;
    this.s3x = s3x;
    this.s3y = s3y;
    this.stroke_style = style;
  }
  draw(ctx){
    ctx.strokeStyle = this.stroke_style;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(this.bx, this.by);
    ctx.lineTo(this.s1x, this.s1y);
    ctx.moveTo(this.bx, this.by);
    ctx.lineTo(this.s2x, this.s2y);
    ctx.moveTo(this.s1x, this.s1y);
    ctx.lineTo(this.s2x, this.s2y);
    ctx.lineTo(this.s3x, this.s3y);
    ctx.stroke();
  }
  moveTo(dx, dy) {
    this.bx += dx;
    this.by += dy;
    this.s1x += dx;
    this.s1y += dy;
    this.s2x += dx;
    this.s2y += dy;
    this.s3x += dx;
    this.s3y += dy;
  }
}

class Ball {
  constructor(sx,sy,rad,style) {
    this.sx = sx;
    this.sy = sy;
    this.rad = rad;
    this.style = style;
  }
  draw(ctx){
    ctx.fillStyle = this.style;
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.sx, this.sy, this.rad,0,Math.PI * 2, true);
    ctx.fill();
    ctx.restore();
  }
  move(dx,dy){
    this.sx += dx;
    this.sy += dy;
  }
}

class MyRectangle{
  constructor(sx,sy,width,height,style){
    this.sx = sx;
    this.sy = sy;
    this.width = width;
    this.height = height;
    this.style = style;
  }
  draw(ctx){
    ctx.fillStyle = this.style;
    ctx.fillRect(this.sx, this.sy, this.width,this.height);
  }
}

class Picture{
  constructor(sx,sy,width,height,path){
    this.sx = sx;
    this.sy = sy;
    this.width = width;
    this.height = height;
    this.path = path;
    const img = new Image();
    img.src = this.path;
    this.img = img;
  }
  draw(ctx){
    ctx.drawImage(this.img, this.sx,this.sy,this.width,this.height);
  }
  move(x,y){
    this.sx += x;
    this.sy += y;
  }
}

const sling = new Sling(start_rock_x, start_rock_y, start_rock_x + 80, start_rock_y-10,start_rock_x + 80, start_rock_y+10, start_rock_x+70, start_rock_y+180,"rgb(120,20,10)");
const ball = new Ball(start_rock_x,start_rock_y,ball_radius,"rbg(255,0,0)");
const rect = new MyRectangle(0,390,1200,30,"rgb(10,250,88)");
const target = new Picture(800,210,209,179,chicken);
everything.push(sling);
everything.push(ball);
everything.push(rect);
everything.push(target);

function drawAll(){
  ctx.clearRect(0,0,width,height);
  everything.forEach(item => item.draw(ctx));
}

function distsq(x1,y1,x2,y2){
  return (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1);
}
function findball(e){
  let x,y;
  if(e.offsetX || e.offsetY){
    x = e.offsetX;
    y = e.offsetY;
  }
  if(distsq(x,y,ball.sx,ball.sy) < ball_radius*ball_radius){
    in_motion = true;
    drawAll();
  }
}
function move_it(e){
  let x = 0,y = 0;
  if(in_motion){
    if(e.offsetX || e.offsetY){
      x = e.offsetX;
      y = e.offsetY;
    }
    ball.sx = x;
    ball.sy = y;
    sling.bx = x;
    sling.by = y;
    drawAll();
  }
}

function finish(e){
  if(in_motion){
    in_motion = !in_motion;
    let auto_cannon = distsq(sling.bx, sling.by,sling.s1x,sling.s1y) / 700;
    let algin = -Math.atan2(sling.s1y-sling.by, sling.s1x-sling.bx);

    hor_velocity = auto_cannon * Math.cos(algin);
    vertical_vel1 = -auto_cannon * Math.sin(algin);
    drawAll();
    time_id = setInterval(change,1000/30);
  }
}

function change(){
  let dx = hor_velocity;
  vertical_vel2 = vertical_vel1 + gravity;
  let dy = (vertical_vel1+vertical_vel2) * 0.5;
  vertical_vel1 = vertical_vel2;
  ball.move(dx,dy);
  let bx = ball.sx,by = ball.sy;
  if((bx >= target.sx + 40 && bx <= target.sy + target.width -40) && (by>=target.sy && by<=target.sy+target.height -40)){
    target.path= feathers;
    drawAll();
  }
  if(by >= rect.sy){
    clearInterval(time_id);
  }
  drawAll();
}
function init(){
  drawAll();
  canvas.addEventListener("mousedown",findball,false);
  canvas.addEventListener("mousemove",move_it,false);
  canvas.addEventListener("mouseup",finish,false);
}

init();

