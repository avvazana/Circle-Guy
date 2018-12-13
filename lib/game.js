time = 0;
createVariables();

function createVariables(){
  openingAudio = new Audio('assets/audio/opening_song.mp3');
  eatingAudio = new Audio('assets/audio/eating.short4.mp3');
  dieAudio = new Audio('assets/audio/die.mp3');
  eatPillAudio = new Audio('assets/audio/eatpill.mp3');
  portalAudio = new Audio('assets/audio/portal2.mp3');
  livesAudio = new Audio('assets/audio/extralives.mp3');
  eatGhostAudio = new Audio('assets/audio/eatghost.mp3');

  pacman = new Pacman(null, null);
  ghosts = [];
  ghosts.push(new RedGhost(null, null));
  ghosts.push(new PinkGhost(null, null));
  ghosts.push(new BlueGhost(null, null));
  ghosts.push(new OrangeGhost(null, null));
  board = new Board(pacman, ghosts);

  direction = 'right';
  nextDirection = 'right';
  nextRotation = '0deg';
  frameNumber = 0;

  score = 0;
  framesPerSecond = 20;
  secondsScared = 10;
  numOfFramesScared = secondsScared * framesPerSecond;
  framesScaredCountdown = -1;

  prevPinkTarget = [];

  dxdyMoves = {
    'left': [-1, 0],
    'right': [1, 0],
    'up': [0, -1],
    'down': [0, 1]
  };

  framesUntilStarting = {
    'red': 20 * 4,
    'pink': 100 * 4,
    'blue': 3000 * 4,
    'orange': 300 * 4
  };
}

function noCoinsLeft(){
  for(let i = 0 ; i < board.tileMap.length - 1 ; i++){
    for(let j = 0; j < board.tileMap[0].length - 1 ; j++){
      if(board.tileMap[i][j].coin || board.tileMap[i][j].pellet) {
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
  e.preventDefault();
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
  if (frameNumber === 0 ){
    frameNumber += 1;
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

function updateGhosts(){
  let ghostDifferences = [];
  let redDifferences = [];
  let pinkDifferences = [];
  let blueDifferences = [];
  let orangeDifferences = [];

  if (frameNumber >= framesUntilStarting['red']){
    redDifferences = ghosts[0].updatePosition();
    ghostDifferences = ghostDifferences.concat(redDifferences);
    updateDifferences(ghosts[0], 0, redDifferences);
  }

  if (frameNumber >= framesUntilStarting['pink']){
    pinkDifferences = ghosts[1].updatePosition();
    ghostDifferences = ghostDifferences.concat(pinkDifferences);
    updateDifferences(ghosts[1], 1, pinkDifferences);  }

  if (frameNumber >= framesUntilStarting['blue']){
    blueDifferences = ghosts[2].updatePosition();
    ghostDifferences = ghostDifferences.concat(blueDifferences);
    updateDifferences(ghosts[2], 2, blueDifferences);  }

  if (frameNumber >= framesUntilStarting.orange){
    orangeDifferences = ghosts[3].updatePosition();
    ghostDifferences = ghostDifferences.concat(orangeDifferences);
    updateDifferences(ghosts[3], 3, orangeDifferences);  }

  return ghostDifferences;
}

function updateDifferences(ghost, idx, differences){
  if (!differences.length){
    return;
  }

  let newXCoord = differences[1][0];
  let newYCoord = differences[1][1];

  let ghostXCoord = ghost.xCoord;
  let ghostYCoord = ghost.yCoord;

  let oldTile = board.tileMap[ghostYCoord][ghostXCoord];
  oldTile['ghost' + (idx+1)] = null;

  let newTile = board.tileMap[newYCoord][newXCoord];
  if(!newTile){
    console.log(newYCoord);
  }
  newTile['ghost' + (idx+1)] = ghosts[idx];

  ghost.xCoord = newXCoord;
  ghost.yCoord = newYCoord;
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
    document.getElementById('pacman').style.animation = 'spin1 1/30s ease';
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
    portalAudio.play();
  } else if (newTile.coin){
    eatingAudio.play();
    score += 10;
  } else if (newTile.pellet) {
    score += 50;
    eatPillAudio.play();
    ghosts.forEach((ghost,idx) => {
      if (!((ghost.xCoord >= 16 && ghost.xCoord <= 17) &&
      (ghost.yCoord >= 7 && ghost.yCoord <= 8) )) {
        ghost.scared = true;
      }
    });
    framesScaredCountdown = numOfFramesScared;
  }
  newTile.coin = false;
  newTile.pellet = false;

  pacman.xCoord = newXCoord;
  pacman.yCoord = newYCoord;
  return [[xCoord, yCoord], [newXCoord, newYCoord]];
}
// if (frameNumber % 3 === 0) {
//
//   ghostDifferences = updateGhosts();
// } else {
//   ghostDifferences = [];
// }
function changeScoreGraphic(){
  document.getElementById("score").innerHTML = "Score" + "     " + score;
}

function updateTargetedTiles(targetTiles) {
  prevXCoord = prevPinkTarget[0];
  prevYCoord = prevPinkTarget[1];

  newXCoord = targetTiles[0];
  newYCoord = targetTiles[1];
  if(prevXCoord){
    oldTile = board.tileMap[prevYCoord][prevXCoord];
    oldTile.pink = null;
  }

  if(newXCoord){
    newTile = board.tileMap[newYCoord][newXCoord];
    newTile.pink = true;
  }

  prevPinkTarget = [newXCoord, newYCoord];
}

function frame() {
  if(frameNumber === 0){
    document.getElementById("status").innerHTML = "Press any key to start";
    if(time === 0 || time === 1){
      openingAudio.play();
      time += 1;
    }
  } else {
    document.getElementById("status").innerHTML = "Good Luck!";
    frameNumber += 1;
    framesScaredCountdown -= 1;
    if(framesScaredCountdown === -1) {
      ghosts.forEach((ghost, idx) => {
        ghost.scared = false;
      });
    }
    if (frameNumber % 3 == 0) {
      let pacmanDifferences = updatePacman();
      let ghostDifferences = [];
      if (frameNumber % 6 == 0) {
      ghostDifferences = updateGhosts();
      }
      if (noCoinsLeft()) {
        document.getElementById("status").innerHTML =
        "<div><img src='assets/winningPacman.gif' width=\"75px\" height=\"75px\"><img src='assets/youWinGhosts.gif' width=\"75px\" height=\"75px\"></div>";
        frameNumber = 0;
        clearInterval(interval);
        setTimeout(reset, 5000);
      }

      let collidedGhosts = checkCollisions(pacmanDifferences, ghostDifferences);
      if (collidedGhosts.notScared.length) {
        document.getElementById("status").innerHTML = "<img src='assets/youLose.gif' width=\"75px\" height=\"75px\"><br> Nice Try";
        pacmanDifferences = pacmanDifferences.slice(0, 1); // don't render pacman's new position -- TODO: need to add animation
        clearInterval(interval);
        dieAudio.play();
        setTimeout(reset, 5000);
        // switch timeout with an add event listener for on key down
      } else if (collidedGhosts.scared.length) {
        collidedGhosts.scared.forEach((ghost,idx) => {
          // ghostDifferences.forEach((difference, idx) =>{
          //   if(difference[0] === collidedGhosts.scared[0].yCoord && difference[1] === collidedGhosts.scared[1].yCoord){
          //   }
          // });
          // pacmanDifferences = pacmanDifferences.slice(0, 1);
          clearInterval(interval);
          setTimeout(timer, 500);
          // pacmanDifferences = ghostDifferences.slice(0, 1); // don't render pacman's new position -- TODO: need to add animation
          score += 100;
          ghost.eaten = true;
          eatGhostAudio.play();
          // score += 100;
        });
      }
      // implement a toggle option that will allow users to see which tile each ghost is targeting
      // this should be rendered each time, along with the actual differences
      // targetTiles = ghosts[1].getTileToTarget();
      // updateTargetedTiles(targetTiles);
      board.renderDifferences(pacmanDifferences, ghostDifferences);
      document.getElementById('pacman').style.transform = `rotate(${this.pacman.rotation})`;
    }
  }
  changeScoreGraphic();
}

function reset(){
  time = 0;
  frameNumber = 0;
  document.getElementById('pacman-board').innerHTML ="";
  createVariables();
  timer();
}

timer();
function timer(){
  interval = setInterval( frame, 1000/framesPerSecond);
}
