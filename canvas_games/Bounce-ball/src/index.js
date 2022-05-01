
const boxX = 20,boxY = 30; //盒子左上角的x,y位置
const boxWidth = 350,boxHeight = 350; //
const ballRad = 10;//ball radius
const boxBoundX = boxWidth + boxX - ballRad; //右边界
const boxBoundY = boxHeight + boxY - ballRad; //下边界
const inBoxBoundX = boxX + ballRad; // 左边界
const inBoxBoundY = boxY + ballRad; //上边界
let [ballX,ballY] = [50,60]; //初始坐标
let ctx; //画布context
let [ballVx,ballVy] = [4,8]; //初始位移
let grad;
let hue = [[255,0,0],[255,255,0],[0,255,0],[0,255,255],[0,0,255],[255,0,255]];
let vx = document.querySelector("#vx");
let vy = document.querySelector("#vy");
let button = document.querySelector("#button");

function init(){
  ctx = document.getElementById("canvas").getContext('2d');
  grad = ctx.createLinearGradient(boxX, boxY,boxX +boxWidth,boxY+boxHeight);
  for(let h = 0;h<hue.length;h++){
    let color = `rgb(${hue[h][0]},${hue[h][1]},${hue[h][2]})`;
    grad.addColorStop(h/6,color);
  }
  ctx.lineWidth = ballRad; 
  ctx.fillStyle = grad;
  moveBall();
  setInterval(moveBall,1000/30);
}
function moveBall(){
  ctx.clearRect(boxX,boxY,boxWidth,boxHeight);
  moveAndCheck();
  ctx.beginPath();
  ctx.arc(ballX,ballY,ballRad,0,Math.PI * 2,true);
  ctx.fill();
  ctx.strokeRect(boxX,boxY,boxWidth,boxHeight);
}
function moveAndCheck(){
  let nextBallX = ballX + ballVx;
  let nextBallY = ballY + ballVy;
  if(nextBallX > boxBoundX){
    nextBallX = boxBoundX; 
    ballVx = -ballVx;
  }else if(nextBallX < inBoxBoundX){
    nextBallX = inBoxBoundX;
    ballVx = -ballVx;
  }
  if(nextBallY > boxBoundY){
    nextBallY = boxBoundY;
    ballVy = -ballVy;
  }
  if(nextBallY < inBoxBoundY){
    nextBallY = inBoxBoundY;
    ballVy = -ballVy;
  }
  ballX = nextBallX;
  ballY = nextBallY;
}
  button.addEventListener("click",()=>{
    ballVx = Number(vx.value);
    ballVy = Number(vy.value);
  });

init();

