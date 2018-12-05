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

score = 0;
framesPerSecond = 12;
secondsScared = 6;
numOfFramesScared = secondsScared * framesPerSecond;
framesScaredCountdown = -1;

dxdyMoves = {
  'left': [-1, 0],
  'right': [1, 0],
  'up': [0, -1],
  'down': [0, 1]
};

function noCoinsLeft(){
  for(let i = 0 ; i < board.tileMap.length - 1 ; i++){
    for(let j = 0; j < board.tileMap[0].length - 1 ; j++){
      if(board.tileMap[i][j].coin || board.tileMap[i][j].pellet) {
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
  frameNumber += 1;
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

  let collidedGhostsScared = [];
  let collidedGhostsNotScared = [];

  for(let ghostVal in ghosts){
    let ghost = ghosts[ghostVal];
    let ghostXCoord = ghost.xCoord;
    let ghostYCoord = ghost.yCoord;

    if (ghostXCoord === pacmanXCoord && ghostYCoord === pacmanYCoord){
      if(ghost.scared) {
        collidedGhostsScared.push(ghost);
      } else {
        collidedGhostsNotScared.push(ghost);
      }
    }
  }
  return {'scared': collidedGhostsScared, 'notScared': collidedGhostsNotScared};
}

function frame() {
  if(frameNumber === 0){
    document.getElementById("status").innerHTML = "Press any key to start";
  } else {
    document.getElementById("status").innerHTML = "Good Luck!";
    frameNumber += 1;
    framesScaredCountdown -= 1;
    if(framesScaredCountdown === -1) {
      ghosts.forEach((ghost, idx) => {
        ghost.scared = false;
      });
    }
    if (frameNumber % 3 === 0) {
      let pacmanDifferences = updatePacman();
      if (frameNumber % 4 === 0) {

        ghostDifferences = updateGhosts();
      } else {
        ghostDifferences = [];
      }
      if (noCoinsLeft()) {
        document.getElementById("status").innerHTML = "<img src='assets/winningPacman.gif' width=\"150px\" height=\"150px\"><br/><h1></h1>";
        clearInterval(interval);
      }
      // if(frameNumber % 4 === 0){
      // } else {
      //   ghostDifferences = [];
      // }

      // if pacman ate the pellet, blue-ify all the ghosts for a 10 seconds
      // then set pacman.atePellet property back to false

      if (pacman.atePellet) {
        ghosts.forEach((ghost) => {
          ghost.scared = true;
          this.setTimer(()=>{ghost.scared = false;}, 10000);
        });
        this.setTimer(()=>{pacman.atePellet = false;}, 10000);
      }

      let collidedGhosts = checkCollisions(pacmanDifferences, ghostDifferences);

      if (collidedGhosts['notScared'].length) {
        document.getElementById("status").innerHTML = "🙁 Game Over 🙁";
        pacmanDifferences = pacmanDifferences.slice(0, 1); // don't render pacman's new position -- TODO: need to add animation
        clearInterval(interval);
      } else if (collidedGhosts['scared'].length) {
        collidedGhosts['scared'].forEach((ghost,idx) => {
          ghost.eaten = true;
          // score += 100;
        });
      }

      board.renderDifferences(pacmanDifferences, ghostDifferences);
      document.getElementById('pacman').style.transform = `rotate(${this.pacman.rotation})`;
    }
  }
}

interval = setInterval( frame, 1000/framesPerSecond);
