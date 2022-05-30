'use strict';
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

let everything = [];
let time_id = null;

let hor_velocity,vertical_vel1,vertical_vel2;
let gravity = 2;

let cannon_x = 10,cannon_y = 280;
let cannon_width = 150,cannon_height = 20;

let ball_radius = 10;
let img_path = "https://s.cn.bing.net/th?id=OIP-C.1-wFaNNsH_OCBFvGCfloWgHaJ4&w=216&h=288&c=8&rs=1&qlt=90&o=6&dpr=2&pid=3.1&rm=2";
let img_path2 ="https://s.cn.bing.net/th?id=OIP-C.GoxNDTP_SlIUQlh42dzVcAHaE7&w=306&h=204&c=8&rs=1&qlt=90&o=6&dpr=2&pid=3.1&rm=2";
let target = {
  x: 500,
  y: 50,
  width: 85,
  height: 280,
}

let htargetx = 450,htargety = 220,htargetw = 355,htargeth = 96;

class Ball {
  constructor(sx,sy,rad,style){
    this.sx = sx;
    this.sy = sy;
    this.rad = rad;
    this.fill_style = style;
  }
  draw(ctx){
    ctx.fillStyle = this.fill_style;
    ctx.beginPath();
    ctx.arc(this.sx,this.sy,this.rad,0,Math.PI * 2, true);
    ctx.fill();
  }
  move(dx,dy){
    this.sx += dx;
    this.sy += dy;
  }
}

class MyRectangle {
  constructor(sx,sy,width,height,style){
    this.sx = sx;
    this.sy = sy;
    this.width = width;
    this.height = height;
    this.fill_style = style;
  }
  draw(ctx){
    ctx.fillStyle = this.fill_style;
    ctx.fillRect(this.sx,this.sy,this.width,this.height);
  }
  move(dx,dy){
    this.sx += dx;
    this.sy += dy;
  }
}

class Picture{
  constructor(sx,sy,width,height,file){
    this.sx = sx;
    this.sy = sy;
    this.width = width;
    this.height = height;
    this.file = file;
    let img = new Image();
    img.src = this.file;
    this.img = img;
  }
  draw(ctx){
    ctx.drawImage(this.img,this.sx,this.sy,this.width,this.height);
  }
  move(dx,dy){
    this.sx += dx;
    this.sy += dy;
  }
}
const ball = new Ball(cannon_x + cannon_width, cannon_y + cannon_height *0.5,ball_radius,"rgb(255,0,0)");
const cannon = new MyRectangle(cannon_x,cannon_y,cannon_width,cannon_height,"rgb(40,40,0)");
const ground = new MyRectangle(0,300,600,30,"rgb(10,250,0)");
const pic_target = new Picture(target.x,target.y,target.width,target.height,img_path);
const h_target = new Picture(htargetx,htargety,htargetw,htargeth,img_path2);

let target_index = everything.length;
everything.push([ball,false]);
everything.push([cannon,true,0,cannon_x,cannon_y+cannon_height * 0.5]);
everything.push([ground,false]);
everything.push([pic_target,false]);

function init() {
  draw_all(ctx);
}
function draw_all(ctx) {
  ctx.clearRect(0, 0,width,height);
  everything.forEach((item) =>{
    if(item[1]){
      ctx.save();
      ctx.translate(item[3],item[4]);
      ctx.rotate(item[2]);
      ctx.translate(-item[3],-item[4]);
      item[0].draw(ctx);
      ctx.restore();
    }else{
    item[0].draw(ctx);
    }
  })
}

function fire(){
  let angle = Number(document.getElementById("ang").value);
  let auto_cannon = Number(document.getElementById("vv").value);

  let angle_radians = angle * (Math.PI / 180);
  hor_velocity = auto_cannon * Math.cos(angle_radians);
  vertical_vel1 = -auto_cannon * Math.sin(angle_radians);
  everything[1][2] = -angle_radians;
  ball.sx = cannon_x+cannon_width * Math.cos(angle_radians);
  ball.sy = cannon_y+cannon_height*0.5 - cannon_width * Math.sin(angle_radians);
  draw_all(ctx);
  if(time_id !== null) clearInterval(time_id);
  time_id = setInterval(change,1000/30);
}

function change(){
  let dx = hor_velocity;
  vertical_vel2 = vertical_vel1 + gravity;
  let dy = (vertical_vel1+vertical_vel2) * 0.5;
  vertical_vel1 = vertical_vel2;
  ball.move(dx,dy);
  let bx = ball.sx;
  let by = ball.sy;
  if((bx >= pic_target.sx && bx <= pic_target.sx + pic_target.width) && (by >= pic_target.sy && by <= pic_target.sy + pic_target.height)){
    everything[everything.length -1] = [h_target,false];
    everything.shift();
    draw_all(ctx);
    clearInterval(time_id);
  }
  if(by >= ground.sy) {
    clearInterval(time_id);
  }
  draw_all(ctx);
}

window.onload = () => {
  init();
  document.getElementById("btn").addEventListener("click",()=>{
    fire();
  })
}