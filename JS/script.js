//get DPI
let dpi = window.devicePixelRatio;
//get canvas
let canvas = document.getElementById('canvas');
//get context
let ctx = canvas.getContext('2d');

let elemLeft = canvas.offsetLeft + canvas.clientLeft;
let elemTop = canvas.offsetTop + canvas.clientTop;
//get CSS height
    //the + prefix casts it to an integer
    //the slice method gets rid of "px"
    let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
    //get CSS width
    let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
function fix_dpi() {
    //scale the canvas
    canvas.setAttribute('height', style_height * dpi);
    canvas.setAttribute('width', style_width * dpi);
    // alert(style_height);
    // alert(style_width);
}
fix_dpi();
class Cell {
    constructor(x, y, cellSize, posX, posY) {
        
        this.x = x;
        this.y = y;
        this.size = cellSize;
        this.posX = posX;
        this.posY = posY;
    }
    //naigbor cells
    // rightCell; leftCell; topCell; botCell;
    neighbors = [];
    isAlive = false;
    color = 'dimgrey';
    tempFlag = false;
    ping() {
        if (!this.isAlive) {
            this.color = 'dimgrey'
            ctx.fillStyle = this.color;
        } else {
            this.color = 'white';
            ctx.fillStyle = this.color;
        }
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    setFlag(flag){
        this.tempFlag = flag;
    }
    evolve(){
        if(this.tempFlag){
            this.ressurect();
        }else
            this.die();
    }
    setneghbors(i, cell) {
        this.neighbors[i] = cell;
    }
    ressurect() {
        this.isAlive = true;
        this.ping();
    }
    die() {
        this.isAlive = false;
        this.ping();
    }
    getAliveNeigbors() {
        var n = 0;
        this.neighbors.forEach(element =>{
            if(element.isAlive){
                n++;
            }
        })
        return n;
    }
    displayCell(){
        console.log(`Cell pos: X = ${this.posX} Y = ${this.posY}`);
        console.log(`left neighbor: X = ${this.neighbors[0].posX} Y = ${this.neighbors[0].posY}`);
        console.log(`top neighbor: X = ${this.neighbors[1].posX} Y = ${this.neighbors[1].posY}`);
        console.log(`right neighbor: X = ${this.neighbors[2].posX} Y = ${this.neighbors[2].posY}`);
        console.log(`Down neighbor: X = ${this.neighbors[3].posX} Y = ${this.neighbors[3].posY}`);
        console.log(`leftUp neighbor: X = ${this.neighbors[4].posX} Y = ${this.neighbors[4].posY}`);
        console.log(`rightDown neighbor: X = ${this.neighbors[5].posX} Y = ${this.neighbors[5].posY}`);
        console.log(`rightUp neighbor: X = ${this.neighbors[6].posX} Y = ${this.neighbors[6].posY}`);
        console.log(`rightDown neighbor: X = ${this.neighbors[7].posX} Y = ${this.neighbors[7].posY}`);
    }
}
let gameSpeed = document.getElementById('gameSpeed').value;
let padding = 1;
let fieldSize = document.getElementById('gameFieldSize').value;
let cellSize = (style_width / fieldSize) - padding;
let rows = fieldSize;
let collums = fieldSize;
let cells = []
//initializing gamefield
function initializeGame() {
    gameSpeed = document.getElementById('gameSpeed').value;
    fieldSize = document.getElementById('gameFieldSize').value;
    rows = fieldSize;
    collums = fieldSize;
    cellSize = (style_width / fieldSize) - padding;
    for (let x = 0; x < rows; x++) {
        cells[x] = [];
        for (let y = 0; y < collums; y++) {
            cells[x][y] = new Cell(((cellSize + padding) * x), ((cellSize + padding) * y), cellSize, x, y);
        }
    }
    setNeighbors();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    RenderCells();
}

function setNeighbors() {
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < collums; y++) {
            //corner cases
            
                if (x == 0 || y == 0){
                    if (x == 0 && y == 0) {
                        //left top corner
                        cells[x][y].neighbors[0] = cells[rows - 1][y]; //left
                        cells[x][y].neighbors[1] = cells[x][collums - 1]; //top
                        cells[x][y].neighbors[2] = cells[x + 1][y]; //right
                        cells[x][y].neighbors[3] = cells[x][y + 1]; //bottom
                        cells[x][y].neighbors[4] = cells[rows - 1][collums - 1]; //leftup
                        cells[x][y].neighbors[5] = cells[rows - 1][y + 1]; //leftdown
                        cells[x][y].neighbors[6] = cells[x + 1][collums - 1]; //rightup
                        cells[x][y].neighbors[7] = cells[x + 1][y + 1]; //rightdown

                    } else if (x == 0 && y < collums-1) {
                        //left side
                        cells[x][y].neighbors[0] = cells[rows - 1][y]; //left
                        cells[x][y].neighbors[1] = cells[x][y - 1]; //top
                        cells[x][y].neighbors[2] = cells[x + 1][y]; //right
                        cells[x][y].neighbors[3] = cells[x][y + 1]; //bottom
                        cells[x][y].neighbors[4] = cells[rows - 1][y - 1]; //leftup
                        cells[x][y].neighbors[5] = cells[rows - 1][y + 1]; //leftdown
                        cells[x][y].neighbors[6] = cells[x + 1][y - 1]; //rightup
                        cells[x][y].neighbors[7] = cells[x + 1][y + 1]; //rightdown
                    } else if (y == 0 && x < rows-1) {
                        //top side
                        cells[x][y].neighbors[0] = cells[x - 1][y]; //left
                        cells[x][y].neighbors[1] = cells[x][collums - 1]; //top
                        cells[x][y].neighbors[2] = cells[x + 1][y]; //right
                        cells[x][y].neighbors[3] = cells[x][y + 1]; //bottom
                        cells[x][y].neighbors[4] = cells[x - 1][collums - 1]; //leftup
                        cells[x][y].neighbors[5] = cells[x - 1][y + 1]; //leftdown
                        cells[x][y].neighbors[6] = cells[x + 1][collums - 1]; //rightup
                        cells[x][y].neighbors[7] = cells[x + 1][y + 1]; //rightdown
                    }
                }
                if (x == 0 || y == collums - 1){
                    if (x == 0 && y == collums - 1) {
                        //left bottom corner
                        cells[x][y].neighbors[0] = cells[rows - 1][y]; //left
                        cells[x][y].neighbors[1] = cells[x][y - 1]; //top
                        cells[x][y].neighbors[2] = cells[x + 1][y]; //right
                        cells[x][y].neighbors[3] = cells[x][0]; //bottom
                        cells[x][y].neighbors[4] = cells[rows - 1][y - 1]; //leftup
                        cells[x][y].neighbors[5] = cells[rows - 1][0]; //leftdown
                        cells[x][y].neighbors[6] = cells[x + 1][y - 1]; //rightup
                        cells[x][y].neighbors[7] = cells[x + 1][0]; //rightdown
                    }
                }
                else if (x == rows - 1 || y == 0){
                    if (x == rows - 1 && y == 0) {
                        //right top corner
                        cells[x][y].neighbors[0] = cells[x - 1][y]; //left
                        cells[x][y].neighbors[1] = cells[x][collums - 1]; //top
                        cells[x][y].neighbors[2] = cells[0][y]; //right
                        cells[x][y].neighbors[3] = cells[x][y + 1]; //bottom
                        cells[x][y].neighbors[4] = cells[x - 1][collums - 1]; //leftup
                        cells[x][y].neighbors[5] = cells[x - 1][y + 1]; //leftdown
                        cells[x][y].neighbors[6] = cells[0][collums - 1]; //rightup
                        cells[x][y].neighbors[7] = cells[0][y + 1]; //rightdown
                    }
                }
                if (x == rows - 1 || y == collums - 1){
                    if (x == rows - 1 && y == collums - 1) {
                        //right bottom corner
                        cells[x][y].neighbors[0] = cells[x - 1][y]; //left
                        cells[x][y].neighbors[1] = cells[x][y - 1]; //top
                        cells[x][y].neighbors[2] = cells[0][y]; //right
                        cells[x][y].neighbors[3] = cells[x][0]; //bottom
                        cells[x][y].neighbors[4] = cells[x - 1][y - 1]; //leftup
                        cells[x][y].neighbors[5] = cells[x - 1][0]; //leftdown
                        cells[x][y].neighbors[6] = cells[0][y - 1]; //rightup
                        cells[x][y].neighbors[7] = cells[0][0]; //rightdown
                    } else if (x == rows - 1 && y > 0) {
                        //right side
                        cells[x][y].neighbors[0] = cells[x - 1][y]; //left
                        cells[x][y].neighbors[1] = cells[x][y - 1]; //top
                        cells[x][y].neighbors[2] = cells[0][y]; //right1
                        cells[x][y].neighbors[3] = cells[x][y + 1]; //bottom
                        cells[x][y].neighbors[4] = cells[x - 1][y - 1]; //leftup
                        cells[x][y].neighbors[5] = cells[x - 1][y + 1]; //leftdown
                        cells[x][y].neighbors[6] = cells[0][y - 1]; //rightup
                        cells[x][y].neighbors[7] = cells[0][y + 1]; //rightdown
                    } else if (y == collums - 1 && x > 0) {
                        //bottom side
                        cells[x][y].neighbors[0] = cells[x - 1][y]; //left
                        cells[x][y].neighbors[1] = cells[x][y - 1]; //top
                        cells[x][y].neighbors[2] = cells[x + 1][y]; //right
                        cells[x][y].neighbors[3] = cells[x][0]; //bottom
                        cells[x][y].neighbors[4] = cells[x - 1][y - 1]; //leftup
                        cells[x][y].neighbors[5] = cells[x - 1][0]; //leftdown
                        cells[x][y].neighbors[6] = cells[x + 1][y - 1]; //rightup
                        cells[x][y].neighbors[7] = cells[x + 1][0]; //rightdown
                    }
                }
                else if(x > 0 && y > 0 && x < rows-1 && y < collums-1) {
                        cells[x][y].neighbors[0] = cells[x - 1][y]; //left
                        cells[x][y].neighbors[1] = cells[x][y - 1]; //top
                        cells[x][y].neighbors[2] = cells[x + 1][y]; //right
                        cells[x][y].neighbors[3] = cells[x][y + 1]; //bottom
                        cells[x][y].neighbors[4] = cells[x - 1][y - 1]; //leftup
                        cells[x][y].neighbors[5] = cells[x - 1][y + 1]; //leftdown
                        cells[x][y].neighbors[6] = cells[x + 1][y - 1]; //rightup
                        cells[x][y].neighbors[7] = cells[x + 1][y + 1]; //rightdown

                }
        }
    }
    
}

//render cells
function RenderCells() {
    cells.forEach(element => {
        element.forEach(element => {
            element.ping();
        });
    });
}
//OnClick even listener
canvas.addEventListener("click", function (event) {
    let x = event.pageX - elemLeft,
        y = event.pageY - elemTop;
    // Collision detection between clicked offset and element.
    cells.forEach(element => {
        element.forEach(cell => {
            if (y > cell.y && y < cell.y + cellSize &&
                x > cell.x && x < cell.x + cellSize) {
                if (cell.isAlive){
                    cell.die();
                    cell.displayCell();
                }
                else{
                    cell.ressurect();
                    cell.displayCell();
                }
                return;
            }
        });
    });
});

//The actual game of life logic
function GameOfLife() {
    cells.forEach(element => {
        element.forEach(element => {
            let aliveNeighbors = element.getAliveNeigbors();
            if (element.isAlive) {
                if (aliveNeighbors == 2 || aliveNeighbors == 3) {
                    element.setFlag(true);
                } else
                    element.setFlag(false);
            } else if (aliveNeighbors == 3) {
                element.setFlag(true);
            }
        });
    });
    cells.forEach(element => {
        element.forEach(element => {
            element.evolve();
        });
    });
}
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }
var on = false;
async function Go(){
    
    if(on) {
        document.getElementById("playButton").innerText = "Go";
        on = false;
    }
    else {
        document.getElementById("playButton").innerText = "Stop";
        on = true;
    }
    while (on) {
        await sleep(gameSpeed);
        GameOfLife();
    }
}
function Reset() {
    document.getElementById("playButton").innerText = "Go";
    on = false; 
    cells.forEach(element => {
        element.forEach(element => {
            if(element.isAlive){
                element.die();
            }
        });
    });
    initializeGame();
}
initializeGame();