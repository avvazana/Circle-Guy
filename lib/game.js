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

  if (frameNumber >= framesUntilStarting['pink']){
    pinkDifferences = updatePinkGhost();
  }

  if (frameNumber >= framesUntilStarting.blue){
    blueDifferences = updateBlueGhost();
  }

  if (frameNumber >= framesUntilStarting.orange){
    orangeDifferences = updateOrangeGhost();
  }

  return ghostDifferences.concat(redDifferences).concat(pinkDifferences);
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

  function getTileToTarget(){
    idx = 0;
    ghost = ghosts[idx];
    let ghostXCoord = ghost.xCoord;
    let ghostYCoord = ghost.yCoord;
    let hypotheticalPacmanXCoord = pacman.xCoord;
    let hypothericalPacmanYCoord = pacman.yCoord;
    let dx = dxdyMoves[direction][0];
    let dy = dxdyMoves[direction][1];

    let leftDx = dxdyMoves['left'][0];
    let leftDy = dxdyMoves['left'][1];
    let rightDx = dxdyMoves['right'][0];
    let rightDy = dxdyMoves['right'][1];
    let upDx = dxdyMoves['up'][0];
    let upDy = dxdyMoves['up'][1];
    let downDx = dxdyMoves['down'][0];
    let downDy = dxdyMoves['down'][1];

    constructive_moves = [];
    non_constructive_moves = [];
    wallsNextToGhost = wallsNextToPlayer(ghost);
    pacmanDirection = direction;

    openingNotFound = true;
    while(openingNotFound){
      hypotheticalPacmanXCoord += dx;
      hypothericalPacmanYCoord += dy;
      if(dy >= board.tileMap.length - 1 || dy < 1 || dx >= board.tileMap[0].length - 1 || dx < 1){
        return [pacman.xCoord, pacman.yCoord];
      }

      if(direction === 'up' || direction === 'down'){
        // if can go left
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
  tileToTarget = getTileToTarget();
  return differencesFromTileToTarget(ghosts[1], 1, tileToTarget[0], tileToTarget[1]);
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

function checkCollisions(pacmanDifferences, ghostDifferences) {
  let pacmanXCoord = pacman.xCoord;
  let pacmanYCoord = pacman.yCoord;

  let pacmanPrevXCoord = pacman.xCoord;
  let pacmanPrevYCoord = pacman.yCoord;
  //if pacman hasn't moved, his prev coordinates are the same as his current
  if (pacmanDifferences.length){
  //if he has moved, his previous coordinates are captured by the first array in pacman differences
    pacmanPrevXCoord = pacmanDifferences[0][0];
    pacmanPrevYCoord = pacmanDifferences[0][1];
  }

  for(let ghostVal in ghosts){
    let ghost = ghosts[ghostVal];

    let currentGhostDifferences = ghostDifferences.slice(ghostVal * 2, ghostVal * 2 + 2);
    let ghostXCoord = ghost.xCoord;
    let ghostYCoord = ghost.yCoord;

    if (ghostXCoord === pacmanXCoord && ghostYCoord === pacmanYCoord){
      return true;
    }

    if (currentGhostDifferences.length){
      let ghostPrevXCoord = currentGhostDifferences[0][0];
      let ghostPrevYCoord = currentGhostDifferences[0][1];
      if(ghostPrevXCoord === pacmanXCoord && ghostPrevYCoord === pacmanYCoord &&
         ghostXCoord === pacmanPrevXCoord && ghostYCoord === pacmanPrevYCoord ){ // so they don't swap places and walk past each other
        return true;
      }
    }
  }
  return false;
}

function frame() {
  frameNumber += 1;
    if (frameNumber % 3 === 0) {
      let pacmanDifferences = updatePacman();
      if(frameNumber % 4 === 0){
        ghostDifferences = updateGhosts();
      } else {
        ghostDifferences = [];
      }
      if (noCoinsLeft()) {
        document.getElementById("status").innerHTML = "🎉 😊  You Won! 😊 🎉";
        clearInterval(interval);
      }
      if(checkCollisions(pacmanDifferences, ghostDifferences)){
        document.getElementById("status").innerHTML = "🙁 Game Over 🙁";
        pacmanDifferences = pacmanDifferences.slice(0, 1); // don't render pacman's new position -- TODO: need to add animation
        clearInterval(interval);
      }
      board.renderDifferences(pacmanDifferences, ghostDifferences);
      document.getElementById('pacman').style.transform = `rotate(${this.pacman.rotation})`;
    }
}

interval = setInterval( frame, 30);
