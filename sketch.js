var PLAY = 1;
var END = 0;
var gameState = PLAY;

var ship, ship_running, ship_collided;
var ground, invisibleGround, groundImage;

var asteroidGroup, asteroidImage;
var obstaclesGroup, obstacle1;

var score=0;

var gameOver, restart;



function preload(){
  ship_running =   loadAnimation("ship.png");
  ship_collided = loadAnimation("crashedship.png");
  
  groundImage = loadImage("ground2.png");
  
  asteroidImage = loadImage("asteroid.png");
  
  obstacle1 = loadImage("rock.png");
  
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);
  
  ship = createSprite(50,180,20,50);
  
  ship.addAnimation("running", ship_running);
  ship.addAnimation("collided", ship_collided);
  ship.scale = 0.05;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  asteroidGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  
  background(20);
  text("Score: "+ score, 500,50);
  ship.setCollider("rectangle",0,0,ship.width,ship.height);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && ship.y >= 159) {
      ship.velocityY = -12;
    }
  
    ship.velocityY = ship.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    ship.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(ship)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    
    ground.velocityX = 0;
    ship.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    asteroidGroup.setVelocityXEach(0);
    coinsGroup.setVelocityXEach(0);
    
    ship.changeAnimation("collided",ship_collided);
    
    
    obstaclesGroup.setLifetimeEach(-1);
    asteroidGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  
  if (frameCount % 90 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(asteroidImage);
    cloud.scale = 0.05;
    cloud.velocityX = -3;
    
     
    cloud.lifetime = 200;
    
    
    cloud.depth = ship.depth;
    ship.depth = ship.depth + 1;
    
    
    asteroidGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
   
    obstacle.velocityX = -(6 + 3*score/100);
    obstacle.addImage(obstacle1);     
    obstacle.scale = 0.05;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  asteroidGroup.destroyEach();
  
  ship.changeAnimation("running",ship_running);
  
 
  
  score = 0;
  
}

