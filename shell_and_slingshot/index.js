'use strict';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

let everything = [];
let time_id = null;

let hor_velocity = 0; //水平位移 保持不变
let vertical_vel1 = 0,vertical_vel2 = 0;// 垂直间隔位移

let gravity = 2; //垂直间隔位移改变量
let ball_x = 20,ball_y = 290;
class Ball {
  constructor(options) {
    this.sx = options.sx;
    this.sy = options.sy;
    this.radius = options.radius;
    this.fill_style = options.style_string;
    // this.draw = draw_ball;
    // this.move_it = move_ball;
  }
  draw(ctx) {
    ctx.fillStyle = this.fill_style;
    ctx.beginPath();
    ctx.arc(this.sx, this.sy, this.radius,0,Math.PI * 2,true);
    ctx.fill();
  }
  move(dx,dy) {
    this.sx += dx;
    this.sy += dy;
  }
}

function rotate_(val){
  return val * (Math.PI / 180);
}
const ball_options = {
  sx: ball_x,
  sy: ball_y,
  radius: 15,
  style_string: "brown",
}

const cball = new Ball(ball_options);

class Myrectangle {
  constructor(sx,sy,width,height,style_string){
    this.sx = sx;
    this.sy = sy;
    this.width = width;
    this.height = height;
    this.fill_style = style_string;
  }
  draw(ctx){
    ctx.fillStyle = this.fill_style;
    ctx.fillRect(this.sx, this.sy, this.width,this.height);
  }
}

const rect_target = new Myrectangle(400,100,80,200,"rgb(0,5,90)");
const ground = new Myrectangle(0,300,600,30,"rgb(10,250,0)");
everything.push(cball);
everything.push(rect_target);
everything.push(ground);

function draw_all(){
  ctx.clearRect(0,0,width,height);
  everything.forEach(item => item.draw(ctx));
}

function fire(){
  // cball.sx = ball_x;
  // cball.sy = ball_y;
  hor_velocity = Number(document.getElementById("hv").value);
  vertical_vel1 = Number(document.getElementById("vv").value);
  time_id = setInterval(()=>{
    change();
    draw_all();
  },1000/30);
}

function change(){
  let dx = hor_velocity;
  vertical_vel2 = vertical_vel1 + gravity;
  let dy = (vertical_vel2 + vertical_vel1) * 0.5;
  vertical_vel1 = vertical_vel2;
  cball.move(dx,dy);
  if(cball.sx >= rect_target.sx && cball.sx <= rect_target.sx + rect_target.width && cball.sy >= rect_target.sy && cball.sy <= rect_target.sy + rect_target.height){
    clearInterval(time_id);
  }
  if(cball.sy >= ground.sy){
    clearInterval(time_id);
  }
  draw_all();
}

function init() {
  //先位移在旋转
  // ctx.fillStyle = "#000000";
  // ctx.save();
  // ctx.translate(50,50);
  // ctx.rotate(-Math.PI / 6);
  // ctx.translate(-50,-50);
  // ctx.fillRect(50, 50, 100, 200);
  // ctx.restore();
  // ctx.fillStyle = "rgb(0,0,255)";
  // ctx.fillRect(50, 50, 50, 50);
  draw_all();
}
init();

document.getElementById("btn").addEventListener("click",()=>{
  fire();
})
