var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};


// inheritance 
function Bean(game, spritesheet) {
    this.animation = new Animation(spritesheet, 160, 360, 12, 0.15, 12, true, 0.5);
	//Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale)
	
    this.speed = 100;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 400);
}

Bean.prototype = new Entity();
Bean.prototype.constructor = Bean;

Bean.prototype.update = function () {
	
	if (this.animation.elapsedTime > this.animation.totalTime / 4) {
				this.x += this.game.clockTick * this.speed;
	}
	
	if (this.x > 1040) {
		this.x = 0;
	}
    
    Entity.prototype.update.call(this);
}
	
Bean.prototype.draw = function () {
	
	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y); 
	
    Entity.prototype.draw.call(this);
}

function Volt(game, spritesheet) {
    this.animation = new Animation(spritesheet, 180, 247.5, 5, 0.10, 10, true, 0.5);
    this.speed = 250;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 250);
}

Volt.prototype = new Entity();
Volt.prototype.constructor = Volt;

Volt.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 1040) this.x = -230;
    Entity.prototype.update.call(this);
}

Volt.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

function Man(game, spritesheet) {
    this.animation = new Animation(spritesheet, 70, 80, 4, 0.10, 40, true, 1.5);
    this.speed = 0;
    this.ctx = game.ctx;
    Entity.call(this, game, 600, 150);
}

Man.prototype = new Entity();
Man.prototype.constructor = Man;

Man.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 1040) this.x = -230;
    Entity.prototype.update.call(this);
}

Man.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}
//------------------------------



AM.queueDownload("./img/bean.png");
AM.queueDownload("./img/ken.png");
AM.queueDownload("./img/background.jpg");
AM.queueDownload("./img/volt.png");




AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.jpg")));
    gameEngine.addEntity(new Bean(gameEngine, AM.getAsset("./img/bean.png")));
	gameEngine.addEntity(new Volt(gameEngine, AM.getAsset("./img/volt.png")));
	gameEngine.addEntity(new Man(gameEngine, AM.getAsset("./img/ken.png")));

	



    console.log("All Done!");
});