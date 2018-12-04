class Pacman {
  constructor(xCoord, yCoord){
    this.xCoord = xCoord;
    this.yCoord = yCoord;
    this.rotation = '0deg';
  }
}

function updatePacman(){

  possibleTileFromCurrentDirection = getNextTileIfDirection(pacman, direction);
  possibleTileFromNextDirection = getNextTileIfDirection(pacman, nextDirection);

  let xCoord = pacman.xCoord;
  let yCoord = pacman.yCoord;
  let dx = dxdyMoves[direction][0];
  let dy = dxdyMoves[direction][1];

  // if the tile from the next direction is not a wall,
  // then we setup pacman to move there
  if(!possibleTileFromNextDirection.wall) {
    dx = dxdyMoves[nextDirection][0];
    dy = dxdyMoves[nextDirection][1];
    pacman.rotation = nextRotation;
    direction = nextDirection;

  // else if the next tile from the current direction is a wall
  // then we avoid updating pacman at all
  } else if (possibleTileFromCurrentDirection.wall){
    return [];
  }

  let newXCoord = xCoord + dx;
  let newYCoord = yCoord + dy;

  if(newXCoord === -1) {
    newXCoord = 33;
  }


  oldTile = board.tileMap[yCoord][xCoord];
  oldTile.pacman = null;

  newTile = board.tileMap[newYCoord][newXCoord];
  newTile.pacman = pacman;

  if (newTile.portalFirst){
    let secondPortalCoordinates = getCoordinatesOfElWithClassName('portalSecond');
    newXCoord = secondPortalCoordinates[0];
    newYCoord = secondPortalCoordinates[1];
    newTile = board.tileMap[newYCoord][newXCoord];
  }
  newTile.coin = false;

  pacman.xCoord = newXCoord;
  pacman.yCoord = newYCoord;
  return [[xCoord, yCoord], [newXCoord, newYCoord]];
}
