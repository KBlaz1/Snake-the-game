var player = [];
var food;

function startGame() {
    myGameArea.start();
    player.push(new snakeCube(10, 10, "green", 30, 120));
    player.push(new snakeCube(10, 10, "green", 20, 120));
    food = new component(10, 10, "red", 600, 400);
}

var myGameArea = {
    canvas: document.createElement("canvas"),

    start: function () {
        this.canvas.width = 800;
        this.canvas.height = 500;
        this.canvas.style = "border:1px solid #d3d3d3;";
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20)   //pokliče updateGameArea funkcijo vsakih 20 milisekund

        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.key = false;
        })

    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function() {
        clearInterval(this.interval);
        alert("Game over!");
        player = [];
        snakeCube.snakeLength = 0;
        startGame();
    }
}
var ctx;
class component {
    constructor(width, height, color, x, y) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.x = x;
        this.y = y;
    }


    update() {
        ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    newPos() {
        //800, 500
        this.x = Math.round(((Math.random() * 790) + 1) / 10) * 10;
        this.y = Math.round(((Math.random() * 490) + 1) / 10) * 10;
    }

    crashWith(otherobj) {
        if (otherobj.x == this.x && otherobj.y == this.y) {
            return true;
        }
        return false;
    }
}

class snakeCube extends component {
    static snakeLength = 0;

    constructor(width, height, color, x, y) {
        super(width, height, color, x, y);
        this.speedX = 0;
        this.speedY = 0;
        snakeCube.snakeLength++;
        this.id = snakeCube.snakeLength;
        this.formerPosition = [];
    }

    newPos() {
        if (player[0].speedX != 0 || player[0].speedY != 0) {

            if (this.id == 1) {
                this.formerPosition = [this.x, this.y];
                this.x += this.speedX;
                this.y += this.speedY;
            }
            else {
                this.formerPosition = [this.x, this.y];
                this.x = player[this.id - 2].formerPosition[0];
                this.y = player[this.id - 2].formerPosition[1];
                player[this.id - 2].formerPosition.splice(0, 1);
            }
        }
    }
}

function createSnakeCube() {
    player.push(new snakeCube(10, 10, "green", player[player.length - 1].x, player[player.length - 1].y));
}

var frameCounter = 0;
function updateGameArea() {
    frameCounter++;
    myGameArea.clear();

    if (myGameArea.key && myGameArea.key == 37 && player[0].speedX <= 0) {
        player[0].speedX = -10;
        player[0].speedY = 0;
    }
    if (myGameArea.key && myGameArea.key == 39 && player[0].speedX >= 0) {
        player[0].speedX = 10;
        player[0].speedY = 0;
    }
    if (myGameArea.key && myGameArea.key == 38 && player[0].speedY <= 0) {
        player[0].speedY = -10;
        player[0].speedX = 0;
    }
    if (myGameArea.key && myGameArea.key == 40 && player[0].speedY >= 0) {
        player[0].speedY = 10;
        player[0].speedX = 0;
    }

    food.update();
    //narišemo kačo
    for (i = 0; i < player.length; i++) {
        player[i].update();
    }

    //Hitrost: na koliko framov se bo kača premaknila
    if (frameCounter == 2) {
        frameCounter = 0;

        //nova pozicija kače
        for (i = 0; i < player.length; i++) {
            player[i].newPos();
        }

        //preverjanje, če kača poje hrano
        if (player[0].crashWith(food)) {
            createSnakeCube();
            food.newPos();
        }

        //preverjanje če se kača ugrizne v rep
        for (i = 1; i < player.length; i++) {
            if (player[0].crashWith(player[i])) {
                myGameArea.stop();
            }
        }

        //preverja koalizijo z robom canvasa
        if (player[0].x > myGameArea.canvas.width -10 || player[0].x < 0 ||
            player[0].y > myGameArea.canvas.height -10 || player[0].y < 0)
            {
                myGameArea.stop();
            }
    }
}