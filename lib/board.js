MAP = [
  [1, 1, 1, 1, 1, 1, 1, 1,  1,  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1],
  [1, 5, 3, 3, 1, 3, 3, 3,  3,  3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 3, 3,  3, 3, 3, 1, 3, 3, 4, 1],
  [1, 3, 1, 3, 1, 3, 1, 2,  1,  3, 3, 3, 3, 1, 1, 1, 2, 1, 1, 1, 2, 3, 3, 3, 3, 1,  3, 1, 3, 1, 3, 1, 3, 1],
  [1, 3, 1, 3, 1, 3, 1, 2, 1,  3, 1, 1, 3, 1, 2, 2, 2, 1, 2, 2, 2, 3, 1, 1, 3, 1,  3, 1, 3, 1, 3, 1, 3, 1],
  [1, 3, 3, 3, 3, 3, 1, 11, 1,  3, 3, 3, 3, 1, 2, 2, 2, 1, 2, 1, 2, 3, 3, 3, 3, 3,  3, 3, 3, 3, 3, 3, 3, 1],
  [1, 3, 1, 1, 1, 3, 1, 1,  1,  3, 1, 1, 3, 1, 1, 1, 4, 1, 1, 1, 4, 3, 1, 1, 3, 1,  1, 1, 3, 1, 1, 1, 3, 1],
  [1, 3, 1, 3, 3, 3, 3, 3,  3,  3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 3, 3,  3, 3, 3, 3, 3, 1, 3, 1],
  [12, 3, 3, 3, 1, 1, 1, 3,  1,  3, 1, 1, 3, 1, 3, 1, 6, 7, 1, 3, 1, 3, 1, 1, 3, 1,  3, 1, 1, 1, 3, 3, 3, 12],
  [1, 3, 1, 3, 3, 1, 3, 3,  1,  3, 3, 3, 3, 1, 3, 1, 8, 9, 1, 3, 1, 3, 3, 3, 3, 1,  3, 3, 1, 3, 3, 1, 3, 1],
  [1, 3, 1, 1, 3, 1, 3, 1,  1,  3, 1, 1, 3, 1, 3, 1, 1, 1, 1, 3, 1, 3, 1, 3, 1, 1,  1, 3, 1, 3, 1, 1, 3, 1],
  [1, 3, 3, 3, 3, 3, 3, 1,  3,  3, 3, 1, 3, 3, 3, 3, 1, 1, 3, 3, 3, 3, 1, 3, 1, 2,  2, 3, 3, 3, 3, 3, 3, 1],
  [1, 3, 1, 1, 3, 1, 3, 3,  3,  1, 3, 3, 3, 1, 1, 3, 3, 3, 3, 1, 1, 3, 3, 3, 1, 10, 1, 3, 1, 3, 1, 1, 3, 1],
  [1, 3, 1, 1, 3, 1, 3, 1,  1,  1, 3, 1, 3, 1, 1, 3, 1, 1, 3, 1, 1, 3, 1, 3, 1, 1,  1, 3, 1, 3, 1, 1, 3, 1],
  [1, 4, 3, 3, 3, 1, 3, 3,  3,  3, 3, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 3, 3,  3, 3, 1, 3, 3, 3, 4, 1],
  [1, 1, 1, 1, 1, 1, 1, 1,  1,  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1],
];

class Board {
  constructor(pacman, ghosts) {
    this.tileMap = [];
    this.pacman = pacman;
    this.ghosts = ghosts;
    this.ghostsHome = {};
    this.initGhostLeavingPosition = [16,6];
    this.setUpBoard(pacman, ghosts);
    this.drawInitialBoard();
  }

  setUpBoard(pacman, ghosts) {
    MAP.forEach((row, y) =>{
      let rowEls = [];
      row.forEach((el, x) => {
        let tileProps = {
          'wall': el === 1,
          'pacman': null,
          'ghost1': null,
          'ghost2': null,
          'ghost3': null,
          'ghost4': null,
          'xCoord': x,
          'yCoord': y,
          'empty': el === 2,
          'pellet': el === 4,
          'portalFirst': el === 10,
          'portalSecond': el === 11,
          'pink': null,
          'arrow': el === 12
        };

        if (el === 5){
          tileProps.pacman = pacman;
          pacman.xCoord = x;
          pacman.yCoord = y;
        }

        for (let i=6; i<=9 ; i++){
          if (el === i){
            ghosts[i-6].xCoord = x;
            ghosts[i-6].yCoord = y;
            tileProps['ghost' + (i-5)] = ghosts[i-6];
            if(i !== 6){
              if (this.ghostsHome[y]){
                this.ghostsHome[y][x] = true;
              } else {
                this.ghostsHome[y] = [];
                this.ghostsHome[y][x] = true;
              }
            }
          }
        }
        rowEls.push(new Tile(tileProps));
      });
      this.tileMap.push(rowEls);
    });
    this.tileMap[7][16].coin = false; //entrance to ghost home
    this.ghostsHome[7] = {};
    this.ghostsHome[7][16] = true;
  }

  drawInitialBoard() {
    this.tileMap.forEach((row, y) => {
      row.forEach((tile, x) => {
        document.getElementById('pacman-board').innerHTML += tile.getHTML();
      });
    });
    document.getElementById('pacman').style.transform = `rotate(${this.pacman.rotation})`;
    // document.getElementsByClassName('arrow')[0].style.transform = 'rotate(90deg)';
  }

  renderDifferences(pacmanDifferences, ghostDifferences){
  pacmanDifferences.forEach( (coord, i) => {
    let xCoord = coord[0];
    let yCoord = coord[1];
    let className = create_coord_class_string(xCoord, yCoord);
    document.getElementsByClassName(className)[0].outerHTML = this.tileMap[yCoord][xCoord].getHTML();
  });

  ghostDifferences.forEach( (coord, i) => {
    let xCoord = coord[0];
    let yCoord = coord[1];
    let className = create_coord_class_string(xCoord, yCoord);
    document.getElementsByClassName(className)[0].outerHTML = this.tileMap[yCoord][xCoord].getHTML();
  });

  // targetTiles.forEach( (coord, i) => {
  //   let xCoord = coord[0];
  //   let yCoord = coord[1];
  //   let className = create_coord_class_string(xCoord, yCoord);
  //   document.getElementsByClassName(className)[0].outerHTML = this.tileMap[yCoord][xCoord].getHTML();
  // });
}
}
