
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const Matched = document.querySelector(".match-count > input");
const time = document.querySelector(".time > input");

let firstPick = true;
let firstCard,secondCard; // 保存选择牌信息

let cardRad = 30; //多边形半径
let deck = []; // 牌组

let [firstSx,firstSy] = [30,50]; //! 位置信息
let [cardWidth,cardHeight] = [4*cardRad,4*cardRad]; //! card 宽高

let margin = 30; // !外边距

let matched = false, startTime = +new Date().getTime(); // * 匹配信息和所用时间

let backColor = "rgb(128,255,128)";
let frontBgColor = "rgb(251,215,73)";
let polyColor = "rgb(255,255,255)";
let tableColor = "rgb(255,255,255)";

class Card {
  constructor(sx,sy,width,height,deckInfo) {
    this.sx = sx;
    this.sy = sy;
    this.width = width;
    this.height = height;
    this.deckInfo = deckInfo; //多边形边数
  }
  drawBack(ctx){
    
    ctx.fillStyle = backColor;
    ctx.fillRect(this.sx,this.sy,this.width,this.height);
    
  }
}

class PolyCard {
  constructor(sx,sy,rad,n) {
    this.sx = sx;
    this.sy = sy;
    this.rad = rad;
    this.n = n;
    this.angle = (2 * Math.PI) / n;
  }
  drawPoly(ctx){
    let rad = this.rad;
    ctx.fillStyle = frontBgColor;
    ctx.fillRect(this.sx - 2*rad, this.sy - 2*rad, rad *4, rad *4);
    ctx.beginPath();
    ctx.fillStyle = polyColor;
    ctx.moveTo(this.sx + rad*Math.cos(-0.5*this.angle),this.sy + rad*Math.sin(-0.5 * this.angle));
    console.log("movex",this.sx + rad*Math.cos(-0.5*this.angle));
    console.log("movey",this.sy + rad*Math.sin(-0.5 * this.angle));
    for(let i = 0; i < this.n; i++) {
      console.log(this.sx + rad * Math.cos((i-0.5)*this.angle));
      console.log(this.sy + rad* Math.sin((i-0.5)*this.angle));
      ctx.lineTo(this.sx + rad * Math.cos((i-0.5)*this.angle),this.sy + rad* Math.sin((i-0.5)*this.angle));
    }
    ctx.closePath();
    ctx.fill();
  }
}

function makeDeck() {
  let aCard,bCard;
  let cx = firstSx,cy = firstSy;
  for (let idx = 3; idx < 9; idx++){
    aCard = new Card(cx,cy,cardWidth,cardHeight,idx);
    deck.push(aCard);
    bCard = new Card(cx,cy + cardHeight + margin,cardWidth,cardHeight,idx);
    deck.push(bCard);
    cx = cx + cardWidth + margin;
    aCard.drawBack(ctx);
    bCard.drawBack(ctx);
  }
  // 随机交换
  shuffle();
}

function shuffle() {
  let len = deck.length;
  let holder;
  for (let i = 0; i < 3 * len; i++) {
    let l = Math.floor(Math.random() * len);
    let k = Math.floor(Math.random() * len);
    holder = deck[l].deckInfo;
    deck[l].deckInfo = deck[k].deckInfo;
    deck[k].deckInfo = holder;
  }
}

function choose(e) {
  let mx = 0,my = 0,pickOne,pickTwo,card;
  mx = e.clientX; 
  my = e.clientY;
  let idx = 0;
  for (idx = 0; idx < deck.length; idx++) {
    card = deck[idx];
    if(card.sx >= 0) {
      // 鼠标点击范围
      if ((mx > card.sx) && (mx < card.sx + card.width) && (my > card.sy && my < card.sy + card.width)) {
        // 判断是否第一次选择
        if(firstPick || (idx !== firstCard)){
          break;
        }
      }
    }
  }
  if(idx < deck.length) {
    // 是否第一次
    if(firstPick) {
      firstCard = idx;
      firstPick = false;
      pickOne = new PolyCard(card.sx + cardWidth * 0.5, card.sy + cardHeight * 0.5,cardRad,card.deckInfo);
      pickOne.drawPoly(ctx);
    }else {
      secondCard = idx;
      pickTwo = new PolyCard(card.sx + cardWidth *0.5, card.sy + cardHeight * 0.5,cardRad,card.deckInfo);
      pickTwo.drawPoly(ctx);

      if(deck[idx].deckInfo === deck[firstCard].deckInfo) {
        matched = true;
        let count = +Matched.getAttribute("value") + 1;
        Matched.setAttribute("value",count);
        if(count >= deck.length * 0.5) {
          let now = new Date();
          let nt = +now.getTime();
          let s = nt - startTime;
          let seconds = Math.floor(0.5+(s)/1000);
          console.log(seconds);
          time.setAttribute("value",seconds.toString()+'s');
          drawText(ctx,seconds);
        }
      }else {
        matched = false;
      }
      // 匹配下一对
      firstPick = true;
      setTimeout(() => {
        flipBack();
      },1000)
    }
  }
}

function flipBack() {
  if(!matched) {
    deck[firstCard].drawBack(ctx);
    deck[secondCard].drawBack(ctx);
  }else {
    ctx.fillStyle = tableColor;
    // 覆盖
    ctx.fillRect(deck[secondCard].sx,deck[secondCard].sy,deck[secondCard].width,deck[secondCard].height);
    ctx.fillRect(deck[firstCard].sx,deck[firstCard].sy,deck[firstCard].width,deck[firstCard].height);
    deck[secondCard].sx = -1;
    deck[firstCard].sx = -1;
  }
}
function drawText(ctx,time) {
  ctx.fillStyle = "rgba(0,0,0,1)"
  ctx.font = "bold 20px sans-serif";
  ctx.fillText(`完成时间:${time}s! 请刷新，重新开始游戏！`,canvas.width/2 - 20,canvas.height/2 -20);
}
function init() {
  makeDeck();
  // new PolyCard(120,120,30,4).drawPoly(ctx);
  canvas.addEventListener("click" ,choose,false);
}

window.onload = () => {
  init();
}