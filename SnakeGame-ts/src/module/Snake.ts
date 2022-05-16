class Snake {
  head: HTMLElement; //头
  bodies: HTMLCollection; //身体
  //整体
  element: HTMLElement;
  canThroughWall: boolean;
  constructor(canThroughWall: boolean) {
    this.element = document.getElementById('snake')!;
    this.head = document.querySelector("#snake > div") as HTMLElement;
    this.bodies = this.element.getElementsByTagName("div");
    this.canThroughWall = canThroughWall;
  }

  get X(){
    return this.head.offsetLeft;
  }
  get Y(): number {
    return this.head.offsetTop;
  }
  set X(value: number) {
    if(this.X === value) return;
    if(value < 0 || value > 290){
      if(!this.canThroughWall){
        value < 0 && (value = 290);
        value > 290 && (value = 0);
      }else{
        throw new Error("game over,gg");
      }
    }
    // if(this.bodies[1] && (this.bodies[1] as HTMLElement).offsetLeft === value){
    //   if(value > this.X){
    //     value = this.X - 10;
    //   }else{
    //     value = this.X + 10;
    //   }
    // }
    this.moveBody();
    this.head.style.left = value + 'px';
    this.checkHeadBody();
  }
  set Y(value: number) {
    if(this.Y === value) return;
    if(value < 0 || value > 290){
      if(!this.canThroughWall){
        value < 0 && (value = 290);
        value > 290 && (value = 0);
      }else{
        throw new Error("game over,gg");
      }
    }
    // if(this.bodies[1] && (this.bodies[1] as HTMLElement).offsetTop === value){
    //   if(value > this.Y){
    //     value = this.Y + 10;
    //   }else{
    //     value = this.Y - 10;
    //   }
    // }
    this.moveBody();
    this.head.style.top = value + "px";
    this.checkHeadBody();
  }
  addBody(){
    let div = document.createElement("div");
    this.element.insertAdjacentElement('beforeend',div);
  }
  // 检查是否撞到自己的头
  checkHeadBody(){
    for(let i = 1;i<this.bodies.length;i++){
      let body = this.bodies[i] as HTMLElement;
      if(this.X === body.offsetLeft && this.Y === body.offsetTop){
        throw new Error("game over,gg");
      }
    }
  }
  moveBody(){
    for(let i = this.bodies.length - 1; i > 0; i--){
      let X = (this.bodies[i-1] as HTMLElement).offsetLeft;
      let Y = (this.bodies[i-1] as HTMLElement).offsetTop;
      (this.bodies[i] as HTMLElement).style.left = X + 'px';
      (this.bodies[i] as HTMLElement).style.top = Y + 'px';
    }
  }
  
}

export default Snake;