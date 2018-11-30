// const Board = require("./board.js");
// const Pacman = require("./pacman.js");
// const board = new Board;
// const el = document.getElementById("pacman")
let timeout = "";
let direction = "";
let prevDirection = "";
let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 3, 3, 3, 3, 3, 3, 3, 3, 1],
    [1, 3, 3, 1, 3, 3, 1, 1, 3, 1],
    [1, 3, 3, 1, 3, 3, 3, 3, 3, 1],
    [1, 3, 3, 1, 1, 3, 3, 1, 3, 1],
    [1, 3, 3, 3, 3, 3, 5, 1, 3, 1],
    [1, 3, 1, 1, 1, 1, 3, 1, 3, 1],
    [1, 3, 3, 3, 3, 3, 3, 3, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

let pacman = {
  x: 6,
  y: 5,
  rotation: '0deg'
};

const gameOver = () => {
  var count = 0;
  for(let i = 0 ; i < map[0].length-1 ; i++){
    for(let j= 0 ; j < map.length-1 ; j++){
      if(map[i][j] === 3) {count+=1;}
    }
  }
  if(count === 0){
    return true;
  } else {
    return false;
  }
};

const drawBoard = (direction) => {
  document.getElementById('pacman-board').innerHTML = "";
  map.forEach(function(row, y){
    row.forEach(function(el, x){
      if(x === pacman.x && y === pacman.y){
        document.getElementById('pacman-board').innerHTML += "<div id='pacman' class='pacman'></div>";
        document.getElementById('pacman').style.transform = `rotate(${pacman.rotation})`;
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
    });
  });

  if (direction) {
    direction();
    // if(prevDirection != direction) {
    //   drawBoard(direction); //if there's a new direction, no timeout necessary
    // } else {
    // }
    timeout = setTimeout(function(){ drawBoard(direction); }, 300);
  }
};
  const moveLeft = () => {
    if(map[pacman.y][pacman.x-1] != 1){
      map[pacman.y][pacman.x] = 2;
      pacman.x -= 1;
      map[pacman.y][pacman.x] = 5;
    }
  };

  const moveUp = () => {
    if(map[pacman.y-1][pacman.x] != 1){
      map[pacman.y][pacman.x] = 2;
      pacman.y -= 1;
      map[pacman.y][pacman.x] = 5;
    }
  };

  const moveRight = () => {
    if(map[pacman.y][pacman.x+1] != 1){
      map[pacman.y][pacman.x] = 2;
      pacman.x += 1;
      map[pacman.y][pacman.x] = 5;
    }
  };

  const moveDown = () => {
    if(map[pacman.y+1][pacman.x] != 1){
      map[pacman.y][pacman.x] = 2;
      pacman.y += 1;
      map[pacman.y][pacman.x] = 5;
    }
  };

  document.onkeydown = function(e){
    if(timeout){ clearTimeout(timeout);}

    let pac = document.getElementById('pacman');
    if(e.keyCode === 37) {
      pacman.rotation = '180deg';

      // if(!prevDirection){
      //   prevDirection = moveLeft;
      // } else {
      //   prevDirection = direction;
      // }
      direction = moveLeft;
    }
    if(e.keyCode === 38) {
      pacman.rotation = '270deg';

      // if(!prevDirection){
      //   prevDirection = moveUp;
      // } else {
      //   prevDirection = direction;
      // }
      direction = moveUp;
    }
    if(e.keyCode === 39) {
      pacman.rotation = '0deg';

      // if(!prevDirection){
      //   prevDirection = moveRight;
      // } else {
      //   prevDirection = direction;
      // }
      direction = moveRight;
    }
    if(e.keyCode === 40) {
      pacman.rotation = '90deg';

      // if(!prevDirection){
      //   prevDirection = moveDown;
      // } else {
      //   prevDirection = direction;
      // }
      direction = moveDown;
    }

    if(!gameOver()){
      drawBoard(direction);
    } else {
      document.getElementById('pacman-board').innerHTML += "<div class='game-over'>YOU WIN</div>";
    }
  };



drawBoard();
