// if(!prevDirection){
//   prevDirection = moveLeft;
// } else {
//   prevDirection = direction;
// }


let timeout = "";
let pacman = new Pacman();
let board = new Board(pacman);

const gameOver = () => {
  var count = 0;
  for(let i = 0 ; i < board.map.length-1 ; i++){
    for(let j= 0 ; j < board.map[0].length-1 ; j++){
      if(board.map[i][j] === 3) {count+=1;}
    }
  }
  if(count === 0){
    return true;
  } else {
    return false;
  }
};

document.onkeydown = function(e){
  if(timeout){ clearTimeout(timeout);}

  let pac = document.getElementById('pacman');

  if(e.keyCode === 37) {
    pacman.rotation = '180deg';
    direction = board.moveLeft;
  }
  if(e.keyCode === 38) {
    pacman.rotation = '270deg';
    direction = board.moveUp;
  }
  if(e.keyCode === 39) {
    pacman.rotation = '0deg';
    debugger
    direction = board.moveRight;
  }
  if(e.keyCode === 40) {
    pacman.rotation = '90deg';
    direction = board.moveDown;
  }

  if(!gameOver()){
    // board.moveGhosts();
    board.drawBoard(direction, 'pacman');
  } else {
    document.getElementById('pacman-board').innerHTML += "<div class='game-over'>YOU WIN</div>";
  }
};

board.drawBoard();
