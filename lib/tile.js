class Tile {
  constructor(props){
    this.wall   = props.wall;
    this.pacman = props.pacman;
    this.ghost1 = props.ghost1;
    this.ghost2 = props.ghost2;
    this.ghost3 = props.ghost3;
    this.ghost4 = props.ghost4;
    this.coin   = !this.pacman && !this.ghost1 && !this.ghost2 && !this.ghost3 && !this.ghost4 && !this.wall;
    this.x_cord = props.x_cord;
    this.y_cord = props.y_cord;
  }

  getHTML(){
		let x_cord = this.x_cord;
		let y_cord = this.y_cord;

		if(this.pacman){
          return "<div id='pacman' class='pacman " + create_cord_class_string(x_cord, y_cord) + "'></div>";
    }
    else if(this.wall){
      return "<div class='wall " + create_cord_class_string(x_cord, y_cord) + "'></div>";
    }
    else if(this.ghost1){
      return "<div class='blinky ghost " + create_cord_class_string(x_cord, y_cord) + "'></div>";
    }
    else if(this.ghost2){
      return "<div class='pinky ghost " + create_cord_class_string(x_cord, y_cord) + "'></div>";
    }
    else if(this.ghost3){
      return "<div class='inky ghost " + create_cord_class_string(x_cord, y_cord) + "'></div>";
    }
    else if(this.ghost4){
      return "<div class='clyde ghost " + create_cord_class_string(x_cord, y_cord) + "'></div>";
    }
    else { // this is a floor tile
    	if(this.coin){
    		return "<div class='coin " + create_cord_class_string(x_cord, y_cord) + "'></div>";
    	}
    	return "<div class='ground " + create_cord_class_string(x_cord, y_cord) + "'></div>";
    }
	}
}

function create_cord_class_string(x_cord, y_cord){
	return `cord_${x_cord}_${y_cord}`;
}
