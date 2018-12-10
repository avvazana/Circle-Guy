function wallsNextToPlayer(player) {
  adjacentWalls = {};
  Object.keys(dxdyMoves).forEach((direction, idx) => {
    tile = getNextTileIfDirection(player, direction);
    if(tile.wall){
      adjacentWalls[direction] = true;
    } else if (board.ghostsHome[tile.yCoord] && board.ghostsHome[tile.yCoord][tile.xCoord]){
      adjacentWalls[direction] = true;
    }
  });
  return adjacentWalls;
}

class Ghost {
  constructor(xCoord, yCoord, constructivePercent){
    this.xCoord = xCoord;
    this.yCoord = yCoord;
    this.scared = false;
    this.eaten = false;
    this.outOfHome = false;
    if(constructivePercent) {
      this.constructivePercent = constructivePercent;
    } else {
      this.constructivePercent = 1;
    }
    this.getDifferencesAndUpdateFromTileToTarget.bind(this);
    this.currentPosition = this.currentPosition.bind(this);
  }

  currentPosition(){
    return [this.xCoord, this.yCoord];
  }

  getDifferencesAndUpdateFromTileToTarget(targetXCoord, targetYCoord){
    function addToMoves(constructiveMoves, nonConstructiveMoves, wallsNextToGhost, directionOne, directionTwo){
			if(!wallsNextToGhost[directionOne]){
			  constructiveMoves.push(directionOne);
      }
			if(!wallsNextToGhost[directionTwo]){
				nonConstructiveMoves.push(directionTwo);
			}
      }

    let differences = [];
    let constructivePercent = this.constructivePercent;
    let constructiveMoves = [];
    let nonConstructiveMoves = [];

    let ghostXCoord = this.xCoord;
    let ghostYCoord = this.yCoord;

    let wallsNextToGhost = wallsNextToPlayer(this);

    if (ghostXCoord === targetXCoord && ghostYCoord === targetYCoord) {
      return [];
    }

    if (ghostXCoord > targetXCoord){
      addToMoves(constructiveMoves, nonConstructiveMoves, wallsNextToGhost, 'left', 'right');
    } else if (ghostXCoord < targetXCoord) {
      addToMoves(constructiveMoves, nonConstructiveMoves, wallsNextToGhost, 'right', 'left');
    } else {
      addToMoves(nonConstructiveMoves, nonConstructiveMoves, wallsNextToGhost, 'right', 'left');
    }

    if (ghostYCoord > targetYCoord){
      addToMoves(constructiveMoves, nonConstructiveMoves, wallsNextToGhost, 'up', 'down');
    } else if (ghostYCoord < targetYCoord) {
      addToMoves(constructiveMoves, nonConstructiveMoves, wallsNextToGhost, 'down', 'up');
    } else {
      addToMoves(constructiveMoves, nonConstructiveMoves, wallsNextToGhost, 'up', 'down');
    }

    if (constructiveMoves.length === 0){
      constructivePercent = 0;
    }
    else if (nonConstructiveMoves.length === 0){
      constructivePercent = 1;
    }

    let randomValue = Math.random();
    let ghostDirection = '';
    if (randomValue < constructivePercent){
      ghostDirection = this.randomElement(constructiveMoves);
    } else {
      ghostDirection = this.randomElement(nonConstructiveMoves);
    }

    if(ghostDirection === undefined){
      return [];
    }

    let dx = dxdyMoves[ghostDirection][0];
    let dy = dxdyMoves[ghostDirection][1];

    let newXCoord = ghostXCoord + dx;
    let newYCoord = ghostYCoord + dy;

    // oldTile = board.tileMap[ghostYCoord][ghostXCoord];
    // oldTile['ghost' + (ghostVal+1)] = null;
    //
    // new_tile = board.tileMap[newYCoord][newXCoord];
    // new_tile['ghost' + (ghostVal+1)] = ghosts[ghostVal];
    //
    // ghosts[ghostVal].xCoord = newXCoord;
    // ghosts[ghostVal].yCoord = newYCoord;

    differences.push([ghostXCoord, ghostYCoord]);
    differences.push([newXCoord, newYCoord]);

    return differences;
  }

  _updatePosition(){
    return []; //default is not to move
  }

  updatePosition(){
    if (this.eaten){
      this.eaten = false;
      this.scared = false;
      this.outOfHome = false;
      return [this.currentPosition(), [16,7]];
    }

    if (!this.outOfHome){
      this.outOfHome = true;
      return [this.currentPosition(), board.initGhostLeavingPosition];
    }
    return this._updatePosition();
  }

  randomProperty(obj){
    let keys = Object.keys(obj);
    return obj[keys[ keys.length * Math.random() << 0]];
  }

  randomElement(arr){
    let random = arr[Math.floor(Math.random() * arr.length)];
    return random;
  }

  getRandomMove(){
    return this.randomProperty(dxdyMoves);
  }
}


class RedGhost extends Ghost {
  constructor(xCoord, yCoord, constructivePercent){
    super(xCoord, yCoord, constructivePercent);
  }

  _updatePosition(){
    let pacmanXCoord = pacman.xCoord;
    let pacmanYCoord = pacman.yCoord;
    return this.getDifferencesAndUpdateFromTileToTarget(pacmanXCoord, pacmanYCoord);
  }
}

class PinkGhost extends Ghost {
  constructor(xCoord, yCoord, constructivePercent){
    super(xCoord, yCoord, constructivePercent);
    this.getTileToTarget = this.getTileToTarget.bind(this);
  }

  getTileToTarget(){
    let ghost = this;
    let ghostXCoord = ghost.xCoord;
    let ghostYCoord = ghost.yCoord;
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

    let openingNotFound = true;
    while(openingNotFound){
      hypotheticalPacmanXCoord += dx;
      hypothericalPacmanYCoord += dy;

      if(dy >= board.tileMap.length - 1 || dy < 1 ||
         dx >= board.tileMap[0].length - 1 || dx < 1){
        return [pacman.xCoord, pacman.yCoord];
      }

      if(direction === 'up' || direction === 'down'){
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
  _updatePosition(){
    let targetTile = this.getTileToTarget();
    return this.getDifferencesAndUpdateFromTileToTarget(targetTile[0], targetTile[1]);
  }
}

class OrangeGhost extends Ghost {
  constructor(xCoord, yCoord, constructivePercent){
    super(xCoord, yCoord, constructivePercent);
    this.getRandomLegalMove = this.getRandomLegalMove.bind(this);
  }

  getRandomLegalMove(){
    let ghost = this;
    let xCoord = ghost.xCoord;
    let yCoord = ghost.yCoord;
    while(true){
      let randomMove = this.getRandomMove();
      let dx = randomMove[0];
      let dy = randomMove[1];
      let newXCoord = xCoord + dx;
      let newYCoord = yCoord + dy;
      let backHomeMove = !(board.ghostsHome[newYCoord] && board.ghostsHome[newYCoord][newXCoord]);
      if(!board.tileMap[newYCoord][newXCoord].wall){
        return [newXCoord, newYCoord];
      }
    }
  }

  _updatePosition(){
    let targetTile = this.getRandomLegalMove();
    return this.getDifferencesAndUpdateFromTileToTarget(targetTile[0], targetTile[1]);
  }
}

class BlueGhost extends Ghost {
  constructor(xCoord, yCoord, constructivePercent){
    super(xCoord, yCoord, constructivePercent);
    this.getRandomLegalMove = this.getRandomLegalMove.bind(this);
  }

  getRandomLegalMove(){
    let ghost = this;
    let xCoord = ghost.xCoord;
    let yCoord = ghost.yCoord;
    while(true){
      let randomMove = this.getRandomMove();
      let dx = randomMove[0];
      let dy = randomMove[1];
      let newXCoord = xCoord + dx;
      let newYCoord = yCoord + dy;
      let backHomeMove = !(board.ghostsHome[newYCoord] && board.ghostsHome[newYCoord][newXCoord]);
      if(!board.tileMap[newYCoord][newXCoord].wall){
        return [newXCoord, newYCoord];
      }
    }
  }

  _updatePosition(){
    let targetTile = this.getRandomLegalMove();
    return this.getDifferencesAndUpdateFromTileToTarget(targetTile[0], targetTile[1]);
  }
}
