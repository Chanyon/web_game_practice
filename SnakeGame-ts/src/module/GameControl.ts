import Food from "./Food";
import Snake from "./Snake";
import Score from "./Score";
export default class GameControl {
  snake:Snake;
  food:Food;
  scorePanel:Score;
  direction:string = "ArrowLeft";
  isLive:boolean = true;

  private YDirections:string[] = ["ArrowUp","Left","ArrowDown","Down"];
  private XDirections:string[] = ["ArrowLeft","Left","ArrowRight","Right"];
  constructor(canThroughWall:boolean = false){
    this.snake = new Snake(canThroughWall);
    this.food = new Food();
    this.scorePanel = new Score();
    this.init();
  }
  init(){
    document.addEventListener("keydown",this.keydownHandler.bind(this));
    this.run();
  }
  keydownHandler(event:KeyboardEvent){
    if(this.direction === event.key ) return;
    switch(event.key){
      case "Up":
      case "Down":
      case "ArrowDown":
      case "ArrowUp":
        if(this.YDirections.includes(this.direction))return;
        this.direction = event.key;
        break;
      case "Left":
      case "Right":
      case "ArrowLeft":
      case "ArrowRight":
        if(this.XDirections.includes(this.direction))return;
        this.direction = event.key;
        break;
    }
  }
  run(){
    let x = this.snake.X;
    let y = this.snake.Y;
    switch(this.direction){
      case "Left":
      case "ArrowLeft":
        x -= 10;
        break;
      case "Right":
      case "ArrowRight":
        x += 10;
        break;
      case "Up":
      case "ArrowUp":
        y -= 10;
        break;
      case "Down":
      case "ArrowDown":
        y += 10;
        break;
    }
    this.checkEat(x,y);
    try {
      this.snake.X = x;
      this.snake.Y = y;
    } catch (error:any) {
      alert(error.message);
      this.isLive = false;
    }
    this.isLive && setTimeout(this.run.bind(this),300);
  }
  checkEat(X: number,Y: number){
    if(this.food.X == X && this.food.Y == Y){
      this.snake.addBody();
      this.food.change(this.snake.bodies);
      this.scorePanel.addScore();
    }
  }
}