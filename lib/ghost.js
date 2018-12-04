class Ghost {
  constructor(xCoord, yCoord){
    this.xCoord = xCoord;
    this.yCoord = yCoord;
  }

}

function updateGhosts(){
  let ghostDifferences = [];
  let framesUntilStarting = {
    'red': 1500,
    'pink': 1000,
    'blue': 0,
    'orange': 1500
  };

  let redDifferences = [];
  let pinkDifferences = [];
  let blueDifferences = [];
  let orangeDifferences = [];

  if (frameNumber >= framesUntilStarting['red']){
    redDifferences = updateRedGhost();
  }

  if (frameNumber >= framesUntilStarting['pink']){
    pinkDifferences = updatePinkGhost();
  }

  if (frameNumber >= framesUntilStarting['blue']){
    blueDifferences = updateBlueGhost();
  }

  if (frameNumber >= framesUntilStarting.orange){
    orangeDifferences = updateOrangeGhost();
  }

  return ghostDifferences.concat(redDifferences).concat(pinkDifferences).concat(blueDifferences);
}

function updateRedGhost(){
  let pacmanXCoord = pacman.xCoord;
  let pacmanYCoord = pacman.yCoord;
  return differencesFromTileToTarget(ghosts[0], 0, pacmanXCoord, pacmanYCoord);
}

function updatePinkGhost(){
  //check where pacman is - is there an opening?
  //if he's going left or right, check up/down for an opening.
  //if he's going up or down, check left/right for an opening.
  //if there's no opening, check the next spot pacman will be in the same direction.
  tileToTarget = getTileToTarget();
  return differencesFromTileToTarget(ghosts[1], 1, tileToTarget[0], tileToTarget[1]);
}

function updateBlueGhost(){
  let ghost = ghosts[2];
  let randomMove = getRandomMove(ghost);
  let differences = differencesFromTileToTarget(ghost, 2, randomMove[0], randomMove[1]);
  debugger
  return differences;
}

  function getRandomMove(ghost){
    let xCoord = ghost.xCoord;
    let yCoord = ghost.yCoord;
    while(true){
      let randomMove = randomProperty(dxdyMoves);
      let dx = randomMove[0];
      let dy = randomMove[1];

      let newXCoord = xCoord + dx;
      let newYCoord = yCoord + dy;
    
      if(!board.tileMap[newYCoord][newXCoord].wall){
        return [newXCoord, newYCoord];
      }
  }
  // let oldTile = board.tileMap[yCoord][xCoord];
  // let newTile = board.tileMap[newYCoord][newXCoord];
  //
  // oldTile.ghost3 = null;
  // newTile.ghost3 = ghost;



}

function updateOrangeGhost(){
  differences = [];

}

function differencesFromTileToTarget(ghost, ghostVal, targetXCoord, targetYCoord){
  debugger
  let constructivePercent = .99;
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
  }
  else if (nonConstructiveMoves.length === 0){
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

function getTileToTarget(){
  // idx = 0;
  // ghost = ghosts[idx];
  // let ghostXCoord = ghost.xCoord;
  // let ghostYCoord = ghost.yCoord;

  let hypotheticalPacmanXCoord = pacman.xCoord;
  let hypothericalPacmanYCoord = pacman.yCoord;
  let dx = dxdyMoves[direction][0];
  let dy = dxdyMoves[direction][1];
  // change in pacman's movements

  let leftDx = dxdyMoves.left[0];
  let leftDy = dxdyMoves.left[1];
  let rightDx = dxdyMoves.right[0];
  let rightDy = dxdyMoves.right[1];
  let upDx = dxdyMoves.up[0];
  let upDy = dxdyMoves.up[1];
  let downDx = dxdyMoves.down[0];
  let downDy = dxdyMoves.down[1];

  // constructive_moves = [];
  // non_constructive_moves = [];
  // wallsNextToGhost = wallsNextToPlayer(ghost);
  pacmanDirection = direction;

  openingNotFound = true;
  while(openingNotFound){
    hypotheticalPacmanXCoord += dx;
    hypothericalPacmanYCoord += dy;

    if(hypothericalPacmanYCoord >= board.tileMap.length - 1 || hypothericalPacmanYCoord < 1 ||
       hypotheticalPacmanXCoord >= board.tileMap[0].length - 1 || hypotheticalPacmanXCoord < 1){
      return [pacman.xCoord, pacman.yCoord];
    }

    if(pacmanDirection === 'up' || pacmanDirection === 'down'){
      // if pacman can go left or right, he's at an opening (so return that tile as the new target)
      if(!board.tileMap[hypothericalPacmanYCoord + leftDy][hypotheticalPacmanXCoord + leftDx].wall){
        return [hypotheticalPacmanXCoord, hypothericalPacmanYCoord];
      } else if(!board.tileMap[hypothericalPacmanYCoord + rightDy][hypotheticalPacmanXCoord + rightDx].wall){
        return [hypotheticalPacmanXCoord, hypothericalPacmanYCoord];
      }
    }
    else { // going left/right
      if(!board.tileMap[hypothericalPacmanYCoord + upDy][hypotheticalPacmanXCoord + upDx].wall){
        return [hypotheticalPacmanXCoord, hypothericalPacmanYCoord];
      } else if(!board.tileMap[hypothericalPacmanYCoord + downDy][hypotheticalPacmanXCoord + downDx].wall){
        return [hypotheticalPacmanXCoord, hypothericalPacmanYCoord];
      }
    }
  }
}

function randomProperty(obj){
  let keys = Object.keys(obj);
  return obj[keys[ keys.length * Math.random() << 0]];
}

function randomElement(arr){
  let random = arr[Math.floor(Math.random() * arr.length)];
  return random;
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
