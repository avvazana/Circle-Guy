//
// const Board = require("./board")
//
//
// const board = new Board;
// const el = document.getElementById("pacman")

let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 5, 3, 3, 3, 3, 3, 3, 3, 1],
    [1, 3, 3, 1, 3, 3, 1, 1, 3, 1],
    [1, 3, 3, 1, 3, 3, 3, 3, 3, 1],
    [1, 3, 3, 1, 1, 3, 3, 1, 3, 1],
    [1, 3, 3, 3, 3, 3, 3, 1, 3, 1],
    [1, 3, 1, 1, 1, 1, 3, 1, 3, 1],
    [1, 3, 3, 3, 3, 3, 3, 3, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

let pacman = {
  x: 1,
  y: 1
};


const drawBoard = () => {
  document.getElementById('pacman-board').innerHTML = "";
  map.forEach(function(row, y){
    row.forEach(function(el, x){
      if(x === pacman.x && y === pacman.y){
        document.getElementById('pacman-board').innerHTML += "<div class='pacman'></div>";
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
  document.onkeydown = function(e){
    if(e.keyCode === 37) {
      if(map[pacman.y][pacman.x-1] != 1){
        map[pacman.y][pacman.x] = 2;
        pacman.x -= 1;
        map[pacman.y][pacman.x] = 5;
      }
    }
    if(e.keyCode === 38) {
      if(map[pacman.y-1][pacman.x] != 1){
        map[pacman.y][pacman.x] = 2;
        pacman.y -= 1;
        map[pacman.y][pacman.x] = 5;
      }
    }
    if(e.keyCode === 39) {
      if(map[pacman.y][pacman.x+1] != 1){
        map[pacman.y][pacman.x] = 2;
        pacman.x += 1;
        map[pacman.y][pacman.x] = 5;
      }
    }
    if(e.keyCode === 40) {
      if(map[pacman.y+1][pacman.x] != 1){
        map[pacman.y][pacman.x] = 2;
        pacman.y += 1;
        map[pacman.y][pacman.x] = 5;
      }
    }
    drawBoard();
  };

};



drawBoard(map);
