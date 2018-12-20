# Circle-Guy
A Pacman-inspired game.
[Circle-Guy Live](https://avivazana.com/Circle-Guy/)

## Instructions 

### Gameplay 

Collect all the dots in the maze while avoiding the four ghosts. 
Collecting a larger pellet will make the ghosts 'scared' for a few moments, so eat them fast!

### Controls 

* Press any key to start 
* Use the arrow keys to control Circle-Guy's movements

## Technologies 

* Vanilla JavaScript 
* CSS
* HTML5

The game is built from scratch, without the aid of external libraries like jQuery or Canvas. 

## Features 

### Rendering 

The board is made up of a grid of tiles, each with a specific property set to true (ie this.pacman = true).
Typically each frame update would re-render the entire board. To avoid this, the changes in movement of the ghosts and of pacman
are saved and sent to a 'render differences' function.

```javascript
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
```

### Ghost Movements 

![alt text](https://github.com/avvazana/Circle-Guy/raw/master/assets/ghostMovements.png "Ghost Movements")

There are 4 ghosts, each with it's own personality.

Red Ghost: heads directly for Circle Guy
Pink Ghost: heads to where Circle Guy is headed
Orange Ghost: runs away from Circle Guy
Blue Ghost: moves randomly

By default, each ghost moves 'constructively' (in line with their personality) 80% of the time. 

```javascript 
    let randomValue = Math.random();
    if (randomValue < constructivePercent){
      ghostDirection = this.randomElement(constructiveMoves);
    } else {
      ghostDirection = this.randomElement(nonConstructiveMoves);
    }

    let dx = dxdyMoves[ghostDirection][0];
    let dy = dxdyMoves[ghostDirection][1];

    let newXCoord = ghostXCoord + dx;
    let newYCoord = ghostYCoord + dy;
```


