class Board {

  constructor(pacman){
    this.map = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1],
      [1, 3, 1, 3, 1, 3, 1, 1, 1, 1, 3, 1, 3, 1],
      [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 1],
      [1, 3, 1, 3, 1, 3, 1, 6, 7, 1, 3, 1, 3, 1],
      [1, 3, 3, 3, 3, 3, 1, 8, 9, 1, 3, 3, 3, 1],
      [1, 3, 1, 3, 1, 3, 1, 1, 1, 1, 3, 1, 3, 1],
      [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 1],
      [1, 3, 1, 1, 1, 3, 1, 1, 1, 1, 3, 1, 3, 1],
      [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    this.drawBoard = this.drawBoard.bind(this);
    this.pacman = pacman;
    this.drawBoard();
    this.moveLeft = this.moveLeft.bind(this);
    this.moveUp = this.moveUp.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this.moveDown = this.moveDown.bind(this);
  }

  moveLeft(character){
    if (character === 'pacman') {
      character = this.pacman;
    }
    if(this.map[character.y][character.x-1] != 1){
      this.map[character.y][character.x] = 2;
      character.x -= 1;
      this.map[character.y][character.x] = 5;
    }
  }

  moveUp(character){
    if (character === 'pacman') {
      character = this.pacman;
    }
    if(this.map[character.y-1][character.x] != 1){
      this.map[character.y][character.x] = 2;
      character.y -= 1;
      this.map[character.y][character.x] = 5;
    }
  }

  moveRight(character){
    debugger
    if (character === 'pacman') {
      character = this.pacman;
    }
    if(this.map[character.y][character.x+1] != 1){
      this.map[character.y][character.x] = 2;
      character.x += 1;
      this.map[character.y][character.x] = 5;
    }
  }

  moveDown(character){
    if (character === 'pacman') {
      character = this.pacman;
    }
    if(this.map[character.y+1][character.x] != 1){
      this.map[character.y][character.x] = 2;
      character.y += 1;
      this.map[character.y][character.x] = 5;
    }
  }

  moveGhosts(){

  }

  drawBoard(direction, character) {
    document.getElementById('pacman-board').innerHTML = "";
    this.map.forEach((row, y) =>{
      row.forEach((el, x) => {
        if(x === this.pacman.x && y === this.pacman.y){
          document.getElementById('pacman-board').innerHTML += "<div id='pacman' class='pacman'></div>";
          document.getElementById('pacman').style.transform = `rotate(${this.pacman.rotation})`;
        }
        if(el === 1){
          document.getElementById('pacman-board').innerHTML += "<div class='wall'></div>";
        }
        if(el === 2){
          document.getElementById('pacman-board').innerHTML += "<div class='ground'></div>";
        }
        if(el === 3){
          document.getElementById('pacman-board').innerHTML += "<div class='coin'></div>";
        }
        if(el === 6){
          document.getElementById('pacman-board').innerHTML += "<div class='blinky ghost'></div>";
        }
        if(el === 7){
          document.getElementById('pacman-board').innerHTML += "<div class='pinky ghost'></div>";
        }
        if(el === 8){
          document.getElementById('pacman-board').innerHTML += "<div class='inky ghost'></div>";
        }
        if(el === 9){
          document.getElementById('pacman-board').innerHTML += "<div class='clyde ghost'></div>";
        }
      });
    });
    debugger
    if (direction) {
      direction(character);
      timeout = setTimeout(()=>{ this.drawBoard(direction, character); }, 300);
    }
  }
}
