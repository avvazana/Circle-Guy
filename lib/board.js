
let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 5, 2, 3, 3, 1, 1, 1, 1],
    [1, 1, 3, 3, 3, 3, 1, 1, 1, 1],
    [1, 1, 3, 3, 3, 3, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const drawBoard = (map) => {
  map.forEach(function(row){
    row.forEach(function(el){
      console.log(el);
    });
  });
};
