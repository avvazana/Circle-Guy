pacman = new Pacman(null, null);
ghosts = [];
ghosts.push(new Ghost(null, null));
ghosts.push(new Ghost(null, null));
ghosts.push(new Ghost(null, null));
ghosts.push(new Ghost(null, null));

board = new Board(pacman, ghosts);
direction = 'right';
nextDirection = 'right';
nextRotation = '0deg';
frameNumber = 0;

dxdyMoves = {
  'left': [-1, 0],
  'right': [1, 0],
  'up': [0, -1],
  'down': [0, 1]
};

function noCoinsLeft(){
  for(let i = 0 ; i < board.tileMap.length - 1 ; i++){
    for(let j = 0; j < board.tileMap[0].length - 1 ; j++){
      if(board.tileMap[i][j].coin) {
        return false;
      }
    }
  }
  return true;
}

function getNextTileIfDirection(player, direction) {
  let xCoord = player.xCoord;
  let yCoord = player.yCoord;
  let dx = dxdyMoves[direction][0];
  let dy = dxdyMoves[direction][1];
  let newXCoord = xCoord + dx;
  let newYCoord = yCoord + dy;
  if(newXCoord === -1){
    newXCoord = 33;
  }
  let nextTile = board.tileMap[newYCoord][newXCoord];
  return nextTile;
}

document.onkeydown = function(e){
  let prevDirection = direction;
  let prevRotation = pacman.rotation;
  //save direction & rotation in case we need to revert back

  if(e.keyCode === 37) {
    direction = 'left';
    pacman.rotation = '180deg';
  }

  if(e.keyCode === 38) {
    direction = 'up';
    pacman.rotation = '270deg';
  }

  if(e.keyCode === 39) {
    direction = 'right';
    pacman.rotation = '0deg';
  }

  if(e.keyCode === 40) {
    direction = 'down';
    pacman.rotation = '90deg';
  }

  possibleNextTile = getNextTileIfDirection(pacman, direction);

  nextDirection = direction;
  nextRotation = pacman.rotation;
  // set next direction and rotation to new values
  if (possibleNextTile.wall) {
  // if the next tile is a wall, revert back to previous values
  //next direction and rotation are still saved, so that pacman can use them at the next opportunity
    direction = prevDirection;
    pacman.rotation = prevRotation;
  }
};

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
  oldTile.pacman = false;

  newTile = board.tileMap[newYCoord][newXCoord];

  if (newTile.portalFirst){
    let secondPortalCoordinates = getCoordinatesOfElWithClassName('portalSecond');
    newXCoord = secondPortalCoordinates[0];
    newYCoord = secondPortalCoordinates[1];
    newTile = board.tileMap[newYCoord][newXCoord];
  }

  newTile.pacman = pacman;
  newTile.coin = false;

  pacman.xCoord = newXCoord;
  pacman.yCoord = newYCoord;
  return [[xCoord, yCoord], [newXCoord, newYCoord]];
}

// function midFramePacman(){
//
// }

function getCoordinatesOfElWithClassName(className){
  let coordInfo = document.getElementsByClassName('portalSecond')[0].className.split(" ")[1].split("_");
  let coordinates = [parseInt(coordInfo[1]) , parseInt(coordInfo[2])];
  return coordinates;
}

function updateGhosts(){
  // let ghost1 = ghosts[0];
  // let constructiveMoves = [];
  // let nonConstructiveMoves = [];
  //
  // xCoord = ghost1.xCoord;
  // yCoord = ghost1.yCoord;
  //
  // let randomMove = randomProperty(dxdyMoves);
  // let dx = randomMove[0];
  // let dy = randomMove[1];
  //
  // let newXCoord = xCoord + dx;
  // let newYCoord = yCoord + dy;
  //
  // if (!board.tileMap[newYCoord][newXCoord]){
  //   console.log(newYCoord);
  //   console.log(newXCoord);
  // }
  // newTile = board.tileMap[newYCoord][newXCoord];
  // if (newTile.wall){
  //   return [];
  // }
  // oldTile = board.tileMap[yCoord][xCoord];
  // oldTile.ghost1 = null;
  // newTile.ghost1 = ghost1;
  //
  //
  // ghost1.xCoord = newXCoord;
  // ghost1.yCoord = newYCoord;
  //
  // return [[xCoord, yCoord], [newXCoord, newYCoord]];
  let ghostDifferences = [];
  let framesUntilStarting = {
    'red': 0,
    'pink': 10,
    'blue': 150,
    'orange': 500
  };

  let redDifferences = [];
  let pinkDifferences = [];
  let blueDifferences = [];
  let orangeDifferences = [];
  if (frameNumber >= framesUntilStarting['red']){
    redDifferences = updateRedGhost();
  }

  if (frameNumber >= framesUntilStarting.pink){
    pinkDifferences = updatePinkGhost();
  }

  if (frameNumber >= framesUntilStarting.blue){
    blueDifferences = updateBlueGhost();
  }

  if (frameNumber >= framesUntilStarting.orange){
    orangeDifferences = updateOrangeGhost();
  }

  return ghostDifferences.concat(redDifferences);
}

function updateRedGhost(){
  let pacmanXCoord = pacman.xCoord;
  let pacmanYCoord = pacman.yCoord;
  return differencesFromTileToTarget(ghosts[0], 0, pacmanXCoord, pacmanYCoord);
}

function updatePinkGhost(){
  return [];
}

function updateBlueGhost(){
  return [];
}

function updateOrangeGhost(){
  return [];
}

function differencesFromTileToTarget(ghost, ghostVal, targetXCoord, targetYCoord){
  let constructivePercent = 0.9;
  let constructiveMoves = [];
  let nonConstructiveMoves = [];
  let differences = [];

  let ghostXCoord = ghost.xCoord;
  let ghostYCoord = ghost.yCoord;

  wallsNextToGhost = wallsNextToPlayer(ghost);
  if (ghostXCoord === targetXCoord && ghostYCoord === targetYCoord) {
    return [];
  }

  if (ghostXCoord > targetXCoord){
    if(!wallsNextToGhost.left) {
      constructiveMoves.push('left');
    }
    if(!wallsNextToGhost.right) {
      nonConstructiveMoves.push('right');
    }
  } else if (ghostXCoord < targetXCoord) {
    if(!wallsNextToGhost.right) {
      constructiveMoves.push('right');
    }
    if(!wallsNextToGhost.left) {
      nonConstructiveMoves.push('left');
    }
  }

  if (ghostYCoord > targetYCoord){
    if(!wallsNextToGhost.up) {
      constructiveMoves.push('up');
    }
    if(!wallsNextToGhost.down) {
      nonConstructiveMoves.push('down');
    }
  } else if (ghostYCoord < targetYCoord) {
    if(!wallsNextToGhost.down) {
      constructiveMoves.push('down');
    }
    if(!wallsNextToGhost.up) {
      nonConstructiveMoves.push('up');
    }
  }

  if (constructiveMoves.length === 0){
    constructivePercent = 0;
  } else if (nonConstructiveMoves.length === 0){
    constructivePercent = 1;
  }

  let randomValue = Math.random();
  if (randomValue < constructivePercent){
    ghostDirection = randomElement(constructiveMoves);
  } else {
    ghostDirection = randomElement(nonConstructiveMoves);
  }

  if(ghostDirection === undefined){
    return [];
  }

  let dx = dxdyMoves[ghostDirection][0];
  let dy = dxdyMoves[ghostDirection][1];

  let newXCoord = ghostXCoord + dx;
  let newYCoord = ghostYCoord + dy;

  oldTile = board.tileMap[ghostYCoord][ghostXCoord];
  oldTile['ghost' + (ghostVal+1)] = null;

  new_tile = board.tileMap[newYCoord][newXCoord];
  new_tile['ghost' + (ghostVal+1)] = ghosts[ghostVal];

  ghosts[ghostVal].xCoord = newXCoord;
  ghosts[ghostVal].yCoord = newYCoord;
  differences.push([ghostXCoord, ghostYCoord]);
  differences.push([newXCoord, newYCoord]);

  return differences;
}

function wallsNextToPlayer(player) {
  adjacentWalls = {};
  Object.keys(dxdyMoves).forEach((direction, idx) => {
    tile = getNextTileIfDirection(player, direction);
    if(tile.wall){
      adjacentWalls[direction] = true;
    }
  });
  return adjacentWalls;
}

function randomProperty(obj){
  let keys = Object.keys(obj);
  return obj[keys[ keys.length * Math.random() << 0]];
}

function randomElement(arr){
  let random = arr[Math.floor(Math.random() * arr.length)];
  return random;
}

function checkCollisions(pacmanDifferences) {
  // let pacmanXCoord = pacman.XCoord;
  // let pacmanYCoord = pacman.YCoord;
}

function frame() {

  frameNumber += 1;
    if (frameNumber % 4 === 0) {
      let pacmanDifferences = updatePacman();
      if(frameNumber % 4 === 0){
        debugger
        ghostDifferences = updateGhosts();
      } else {
        ghostDifferences = [];
      }
      if (noCoinsLeft()) {
        document.getElementById("status").innerHTML = "🎉 You Won! 🎉 😊 🎉";
        clearInterval(interval);
      }
      checkCollisions();
      board.renderDifferences(pacmanDifferences, ghostDifferences);
      document.getElementById('pacman').style.transform = `rotate(${this.pacman.rotation})`;
    }
}

interval = setInterval( frame, 30);
