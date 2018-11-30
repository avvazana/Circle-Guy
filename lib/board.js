
class Board {

  constructor(){
    this.map = [
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
  }

  drawBoard(direction) {
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
  }
}

export module Board;
