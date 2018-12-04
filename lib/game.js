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
        debugger
        console.log(j);
        console.log(i);
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
  // frameNumber += 1;
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

function getCoordinatesOfElWithClassName(className){
  let coordInfo = document.getElementsByClassName('portalSecond')[0].className.split(" ")[1].split("_");
  let coordinates = [parseInt(coordInfo[1]) , parseInt(coordInfo[2])];
  return coordinates;
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
  //
  // if(frameNumber === 0){
  //   document.getElementById("status").innerHTML = "Press P to Play";
  // }
  frameNumber += 1;
    if (frameNumber % 3 === 0) {
      let pacmanDifferences = updatePacman();
      debugger
      let ghostDifferences = updateGhosts();
      if (noCoinsLeft()) {
        document.getElementById("status").innerHTML = "🎉 😊  You Won! 😊 🎉";
        clearInterval(interval);
      }
        // if(frameNumber % 4 === 0){
      // } else {
      //   ghostDifferences = [];
      // }

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
