var gameEngine = new GameEngine();

// assignment 3 below

var save;
var socket = io.connect("http://24.16.255.56:8888");


socket.on("connect", function () {
    console.log("Socket connected.")
});

// assignment 3 above

// GameBoard code below

function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function Circle(game) {
    this.player = 1;
    this.radius = 20;
    this.visualRadius = 500;
    this.isCircle = true;
    this.colors = ["Red", "Green", "Blue", "White"];
    this.setNotIt();
    Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));

    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000};
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
};

Circle.prototype = new Entity();
Circle.prototype.constructor = Circle;

Circle.prototype.setIt = function () {
    this.it = true;
    this.color = 0;
    this.visualRadius = 500;
};

Circle.prototype.setNotIt = function () {
    this.it = false;
    this.color = 3;
    this.visualRadius = 200;
};

Circle.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};


Circle.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

Circle.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

Circle.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

Circle.prototype.collideBottom = function () {
    return (this.y + this.radius) > 800;
};

Circle.prototype.update = function () {
    Entity.prototype.update.call(this);

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if ((ent != this && this.collide(ent)) || rectCircleColliding(this, ent)) {
            // console.log("hello");
            // console.log("circle: ", (ent != this && this.collide(ent)))
            // console.log("Rectangle", ent != this && rectCircleColliding(this, ent));
            var temp = { x: this.velocity.x, y: this.velocity.y };

            var dist = distance(this, ent);
            var delta = this.radius + ent.radius - dist;
            var difX = (this.x - ent.x)/dist;
            var difY = (this.y - ent.y)/dist;

            this.x += difX * delta / 2;
            this.y += difY * delta / 2;
            ent.x -= difX * delta / 2;
            ent.y -= difY * delta / 2;

            this.velocity.x = ent.velocity.x * friction;
            this.velocity.y = ent.velocity.y * friction;
            ent.velocity.x = temp.x * friction;
            ent.velocity.y = temp.y * friction;
            this.x += this.velocity.x * this.game.clockTick;
            this.y += this.velocity.y * this.game.clockTick;
            ent.x += ent.velocity.x * this.game.clockTick;
            ent.y += ent.velocity.y * this.game.clockTick;
            if (this.it) {
                this.setNotIt();
                ent.setIt();
                ent.radius += 1;
            }
            else if (ent.it) {
                this.setIt();
                ent.setNotIt();
                ent.radius -= 1;
            }
        }
        if (rectCircleColliding(this, ent)) {
            var temp = { x: this.velocity.x, y: this.velocity.y };

            var dist = distance(this, ent);
            var delta = this.radius + ent.radius - dist;
            var difX = (this.x - ent.x)/dist;
            var difY = (this.y - ent.y)/dist;

            this.x += difX * delta / 2;
            this.y += difY * delta / 2;
            ent.x -= difX * delta / 2;
            ent.y -= difY * delta / 2;

            this.velocity.x = ent.velocity.x * friction;
            this.velocity.y = ent.velocity.y * friction;
            ent.velocity.x = temp.x * friction;
            ent.velocity.y = temp.y * friction;
            this.x += this.velocity.x * this.game.clockTick;
            this.y += this.velocity.y * this.game.clockTick;
            ent.x += ent.velocity.x * this.game.clockTick;
            ent.y += ent.velocity.y * this.game.clockTick;
            if (this.it) {
                this.setNotIt();
                ent.setIt();
                ent.radius += 1;
            }
            else if (ent.it) {
                this.setIt();
                ent.setNotIt();
                ent.radius -= 1;
            }
        }
        if (rectCircleColliding({ x: ent.x, y: ent.y, radius: this.radius }, {x: ent.x, y: ent.y, w: ent.width, h: ent.height })) {
            //red
			if (this.it && dist > this.radius + ent.radius + 10) {
                var difX = (ent.x - this.x)/dist;
                var difY = (ent.y - this.y)/dist;
                this.velocity.x += difX * acceleration / (dist*dist);
                this.velocity.y += difY * acceleration / (dist * dist);
                var speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
                if (speed > maxSpeed) {
                    var ratio = maxSpeed / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
            }
			//white
            if (ent.it && dist > this.radius + ent.radius) {
                var difX = (ent.x - this.x) / dist;
                var difY = (ent.y - this.y) / dist;
                this.velocity.x -= difX * acceleration / (dist * dist);
                this.velocity.y -= difY * acceleration / (dist * dist);
                var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
                if (speed > maxSpeed) {
                    var ratio = maxSpeed / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
            }
        }
        //console.log(ent != this && rectCircleColliding({ x: ent.x, y: ent.y, radius: this.radius }, {x: ent.x, y: ent.y, width: ent.width, height: ent.height}));
        if ((ent != this && this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius }))) {
            //console.log("hello");
           // console.log("circle: ", (ent != this && this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius })))
           // console.log("Rectangle", ent != this && rectCircleColliding({ x: ent.x, y: ent.y, radius: this.radius }, {x: ent.x, y: ent.y, w: ent.width, h: ent.height}));
            var dist = distance(this, ent);


			//red
			if (this.it && dist > this.radius + ent.radius + 10) {
                var difX = (ent.x - this.x)/dist;
                var difY = (ent.y - this.y)/dist;
                this.velocity.x += difX * acceleration / (dist*dist);
                this.velocity.y += difY * acceleration / (dist * dist);
                var speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
                if (speed > maxSpeed) {
                    var ratio = maxSpeed / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
            }
			//white
            if (ent.it && dist > this.radius + ent.radius) {
                var difX = (ent.x - this.x) / dist;
                var difY = (ent.y - this.y) / dist;
                this.velocity.x -= difX * acceleration / (dist * dist);
                this.velocity.y -= difY * acceleration / (dist * dist);
                var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
                if (speed > maxSpeed) {
                    var ratio = maxSpeed / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
            }
        }
    }


    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
};

Circle.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.colors[this.color];
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

};



// the "main" code begins here
function Rectangle(game, startX, startY) {
	this.x = startX;
	this.y = startY;
	this.width = Math.floor(Math.random() * 100 + 10);
	this.height = Math.floor(Math.random() * 100 + 10);
	this.colors = ["White", "Red", "Green", "Blue"];
	Entity.call(this, game, this.x, this.y);
}


Rectangle.prototype = new Entity();
Rectangle.prototype.constructor = Rectangle;

// return true if the rectangle and circle are colliding
function rectCircleColliding (cir, rec) {
    // distance from the circle center to the rectangle
    var distX = Math.abs(cir.x - rec.x);
    var distY = Math.abs(cir.y - rec.y);

    // if the distance is greater than half circle and half rectangle,
    // they are far apart from colliding
    if (distX > (rec.w / 2 + cir.radius)) {
        // console.log("false 1: ");
        return false;
    }
    if (distY > (rec.h / 2 + cir.radius)) {
        // console.log("false 2: ");
        return false;
    }
    // if the distance is less than haft rectangle, then they are colling
    if (distX <= (rec.w / 2)) {
        // console.log("true 1: ");
        return true;
    }
    if (distY <= (rec.h / 2)) {
        // console.log("true 2: ");
        return true;
    }
    // test the collision at the rectangle corners
    var dx = distX - rec.w / 2;
    var dy = distY - rec.h / 2;
    var distance = dx * dx + dy * dy ;
    // console.log("oh yeah");
    return (distance <= (cir.r * cir.r));
}

Rectangle.prototype.update = function () {

};

Rectangle.prototype.draw = function (ctx) {
    ctx.beginPath();

	ctx.lineWidth = "2";
	ctx.strokeStyle = this.colors[Math.floor(Math.random() * 3)];

    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();

};

// assignment 3 below

function saveSim() {

var velocity = [];
var x = [];
var y = [];
var it = [];
var visualRadius = [];
var color = [];

var width = [];
var height = [];



var length = 0;
for (var i = 0; i < gameEngine.entities.length; i++) {
  velocity.push(gameEngine.entities[i].velocity);
  x.push(gameEngine.entities[i].x);
  y.push(gameEngine.entities[i].y);
  it.push(gameEngine.entities[i].it);
  visualRadius.push(gameEngine.entities[i].visualRadius);
  color.push(gameEngine.entities[i].color);

  width.push(gameEngine.entities[i].width);
  height.push(gameEngine.entities[i].height);



  if (typeof(gameEngine.entities[i].color) != "undefined") {
    length++;
  }
}

var totalLength = gameEngine.entities.length;

save = {vel: velocity, x: x, y: y, it: it, vis: visualRadius, col: color, wid: width, hei: height, len: length, total: totalLength};


socket.emit("save", { studentname: "Thu Vuong", statename: "Save", data: save });

}


function loadSim() {

          socket.emit("load", { studentname: "Thu Vuong", statename: "Save" });

          socket.on("load", function (data) {

              var loadData = data.data;

              console.log(loadData);

              var velocity = loadData.vel;
              var x = loadData.x;
              var y = loadData.y;
              var it = loadData.it;
              var visualRadius = loadData.vis;
              var color = loadData.col;

              var width = loadData.wid;
              var height = loadData.hei;


              for (var i = 0; i < gameEngine.entities.length; i++) {
                gameEngine.entities[i].removeFromWorld = true;
              }

              for (var i = 0; i < loadData.len; i++) {
                var theCircle = new Circle(gameEngine);
                theCircle.velocity = velocity[i];
                theCircle.x = x[i];
                theCircle.y = y[i];
                theCircle.it = it[i];
                theCircle.visualRadius = visualRadius[i];
                theCircle.color = color[i];

                gameEngine.addEntity(theCircle);

              }

              for (var i = loadData.len; i < loadData.total; i++) {
                var theRec = new Rectangle(gameEngine);
                theRec.x = x[i];
                theRec.y = y[i];
                theRec.width = width[i];
                theRec.height = height[i];

                gameEngine.addEntity(theRec);

              }


          });


}

// assignment 3 above

var friction = 1;
var acceleration = 1000000;
var maxSpeed = 200;

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/960px-Blank_Go_board.png");
ASSET_MANAGER.queueDownload("./img/black.png");
ASSET_MANAGER.queueDownload("./img/white.png");

ASSET_MANAGER.downloadAll(function () {
    // console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');


    // var gameEngine = new GameEngine();
    var circle = new Circle(gameEngine);
	var rect = new Rectangle(gameEngine, Math.floor(Math.random() * 600) ,Math.floor(Math.random() * 600));

    circle.setIt();
    gameEngine.addEntity(circle);


    for (var i = 0; i < 12; i++) {
        circle = new Circle(gameEngine);
        gameEngine.addEntity(circle);
    }

    gameEngine.addEntity(rect);

	for (var i = 0; i < 5; i++) {
		rect = new Rectangle(gameEngine, Math.floor(Math.random() * 600), Math.floor(Math.random() * 600));
		gameEngine.addEntity(rect);
	}

    gameEngine.init(ctx);
    gameEngine.start();
});
