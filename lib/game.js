//
// const Board = require("./board")
//
//
// const board = new Board;
// const el = document.getElementById("pacman")
let widthProperty = '50px';

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
  y: 1,
  rotation: '0deg'
};

const gameOver = () => {
  var count = 0;
  for(let i = 0; i < map[0].length-1; i++){
    for(let j= 0; j< map.length-1; j++){
      if(map[i][j] === 3) {count+=1;}
    }
  }
  debugger
  if(count === 0){
    return true;
  } else {
    return false;
  }
};

const drawBoard = () => {
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
  document.onkeydown = function(e){
    let pac = document.getElementById('pacman');
    if(e.keyCode === 37) {
      if(map[pacman.y][pacman.x-1] != 1){
        map[pacman.y][pacman.x] = 2;
        pacman.x -= 1;
        map[pacman.y][pacman.x] = 5;
      }
      pacman.rotation = '180deg';
    }
    if(e.keyCode === 38) {
      if(map[pacman.y-1][pacman.x] != 1){
        map[pacman.y][pacman.x] = 2;
        pacman.y -= 1;
        map[pacman.y][pacman.x] = 5;
      }
      pacman.rotation = '270deg';
    }
    if(e.keyCode === 39) {
      if(map[pacman.y][pacman.x+1] != 1){
        map[pacman.y][pacman.x] = 2;
        pacman.x += 1;
        map[pacman.y][pacman.x] = 5;
      }
      pacman.rotation = '0deg';
    }
    if(e.keyCode === 40) {
      if(map[pacman.y+1][pacman.x] != 1){
        map[pacman.y][pacman.x] = 2;
        pacman.y += 1;
        map[pacman.y][pacman.x] = 5;
      }
      pacman.rotation = '90deg';
    }
    if(!gameOver()){
      drawBoard(widthProperty);
    } else {
      document.getElementById('pacman-board').innerHTML += "<div class='game-over'>YOU WIN</div>";
    }
  };

};



drawBoard(map);
