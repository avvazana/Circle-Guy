class Pacman {

  constructor(){
    this.x = 6;
    this.y = 5;
    this.rotation = '0deg';
  }

  moveLeft(){
    if(map[pacman.y][pacman.x-1] != 1){
      map[pacman.y][pacman.x] = 2;
      pacman.x -= 1;
      map[pacman.y][pacman.x] = 5;
    }
  }

  moveUp(){
    if(map[pacman.y-1][pacman.x] != 1){
      map[pacman.y][pacman.x] = 2;
      pacman.y -= 1;
      map[pacman.y][pacman.x] = 5;
    }
  }

  moveRight(){
    if(map[pacman.y][pacman.x+1] != 1){
      map[pacman.y][pacman.x] = 2;
      pacman.x += 1;
      map[pacman.y][pacman.x] = 5;
    }
  }

  moveDown(){
    if(map[pacman.y+1][pacman.x] != 1){
      map[pacman.y][pacman.x] = 2;
      pacman.y += 1;
      map[pacman.y][pacman.x] = 5;
    }
  }

}
