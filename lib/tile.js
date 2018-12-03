class Tile {
  constructor(props){
    this.wall   = props.wall;
    this.pacman = props.pacman;
    this.ghost1 = props.ghost1;
    this.ghost2 = props.ghost2;
    this.ghost3 = props.ghost3;
    this.ghost4 = props.ghost4;
    this.empty = props.empty;
    this.portalFirst = props.portalFirst;
    this.portalSecond = props.portalSecond;
    this.coin   = !this.pacman && !this.ghost1 && !this.ghost2 && !this.ghost3 && !this.ghost4 && !this.wall && !this.empty;
    this.xCoord = props.xCoord;
    this.yCoord = props.yCoord;
  }

  getHTML(){
		let xCoord = this.xCoord;
		let yCoord = this.yCoord;

		if(this.pacman){
      return "<div id='pacman' class='pacman " + create_coord_class_string(xCoord, yCoord) + "'></div>";
    }
    else if(this.wall){
      return "<div class='wall " + create_coord_class_string(xCoord, yCoord) + "'></div>";
    }
    else if(this.ghost1){
      return "<div class='blinky ghost " + create_coord_class_string(xCoord, yCoord) + "'></div>";
    }
    else if(this.ghost2){
      return "<div class='pinky ghost " + create_coord_class_string(xCoord, yCoord) + "'></div>";
    }
    else if(this.ghost3){
      return "<div class='inky ghost " + create_coord_class_string(xCoord, yCoord) + "'></div>";
    }
    else if(this.ghost4){
      return "<div class='clyde ghost " + create_coord_class_string(xCoord, yCoord) + "'></div>";
    }
    else if(this.portalFirst){
      return "<div class='portalFirst " + create_coord_class_string(xCoord, yCoord) + "'></div>";
    }
    else if(this.portalSecond){
      return "<div class='portalSecond " + create_coord_class_string(xCoord, yCoord) + "'></div>";
    }
    else { // this is a floor tile
    	if(this.coin){
    		return "<div class='coin " + create_coord_class_string(xCoord, yCoord) + "'></div>";
    	}
    	return "<div class='ground " + create_coord_class_string(xCoord, yCoord) + "'></div>";
    }
	}
}

function create_coord_class_string(xCoord, yCoord){
  return "coord_" + xCoord + "_" + yCoord
}
