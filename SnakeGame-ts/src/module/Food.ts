class Food {
  foodElement:HTMLElement;
  constructor(){
    this.foodElement = document.getElementById("food")!;
  }
  get X(){
    return this.foodElement.offsetLeft;
  }
  get Y(){
    return this.foodElement.offsetTop;
  }
  change(snakeBody:HTMLCollection){
    // 食物坐标
    let left:number = Math.round(Math.random() * 29) * 10;
    let top = Math.round(Math.random() * 29) * 10;

    let foodInSnake:boolean = false;
    for (let i = 0; i < snakeBody.length; i++) {
      let body = snakeBody[i] as HTMLElement;
      if(left === body.offsetLeft && top === body.offsetTop){
        foodInSnake = true;
      }
    }
    if(foodInSnake){
      this.change(snakeBody);
    }else{
      this.foodElement.style.left = `${left}px`;
      this.foodElement.style.top = `${top}px`;
    }
  }
}

export default Food;