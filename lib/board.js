class Board {

  constructor(pacman, ghosts){
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
    this.ghosts = ghosts;
    this.drawBoard();
    this.moveLeft = this.moveLeft.bind(this);
    this.moveUp = this.moveUp.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this.moveDown = this.moveDown.bind(this);
    this.validMove = this.validMove.bind(this);
  }

  moveLeft(character){
    if (character === 'pacman') {
      character = this.pacman;
    }
    if(this.map[character.y][character.x-1] != 1){
      this.map[character.y][character.x] = 2;
      character.x -= 1;
      this.map[character.y][character.x] = character.value;
    }
  }

  moveUp(character){
    if (character === 'pacman') {
      character = this.pacman;
    }
    if(this.map[character.y-1][character.x] != 1){
      this.map[character.y][character.x] = 2;
      character.y -= 1;
      this.map[character.y][character.x] = character.value;
    }
  }

  moveRight(character){
    if (character === 'pacman') {
      character = this.pacman;
    }
    if(this.map[character.y][character.x+1] != 1){
      if (character === this.pacman) {
        this.map[character.y][character.x] = 2;
      } else {
        this.map[character.y][character.x] = 3;
      }
      character.x += 1;
      this.map[character.y][character.x] = character.value;
    }
  }

  moveDown(character){
    if (character === 'pacman') {
      character = this.pacman;
    }
    if(this.map[character.y+1][character.x] != 1){

      this.map[character.y][character.x] = 2;
      character.y += 1;
      this.map[character.y][character.x] = character.value;
    }
  }

  moveGhosts(){
    let moves = [this.moveUp, this.moveDown, this.moveLeft, this.moveRight];
    this.ghosts.forEach( (ghost) => {
      let randomMove = moves[Math.floor(Math.random() * moves.length)];
      while (!this.validMove(ghost, randomMove)) {
        randomMove = moves[Math.floor(Math.random() * moves.length)];
      }
      randomMove(ghost);
    });
  }

  validMove(ghost, move) {
    if (move === this.moveLeft) {
      let potentialMove = this.map[ghost.y][ghost.x-1];
      if(potentialMove === 1 ||
        potentialMove === 6 ||
        potentialMove === 7 ||
        potentialMove === 8 ||
        potentialMove === 9
      ){
        return false;
      } else {
        return true;
      }
    } else if (move === this.moveUp) {
      let potentialMove = this.map[ghost.y-1][ghost.x];
      if(potentialMove === 1 ||
        potentialMove === 6 ||
        potentialMove === 7 ||
        potentialMove === 8 ||
        potentialMove === 9
      ){
        return false;
      } else {
        return true;
      }
    } else if (move === this.moveRight) {
      let potentialMove = this.map[ghost.y][ghost.x+1];
      if(potentialMove === 1 ||
        potentialMove === 6 ||
        potentialMove === 7 ||
        potentialMove === 8 ||
        potentialMove === 9
      ){
        return false;
      } else {
        return true;
      }
    } else if (move === this.moveDown) {
      let potentialMove = this.map[ghost.y+1][ghost.x];
      if(potentialMove === 1 ||
        potentialMove === 6 ||
        potentialMove === 7 ||
        potentialMove === 8 ||
        potentialMove === 9
      ){
        return false;
      } else {
        return true;
      }
    }
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

    if (direction) {
      direction(character);
      setTimeout(()=>{board.moveGhosts();}, 300);
      timeout = setTimeout(()=>{ this.drawBoard(direction, character); }, 300);
    }
  }
}
