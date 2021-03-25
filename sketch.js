/*************************************************************************
 ART385 Project 2
          by Maj Jenkins
    March 24, 2021

    Overview:
    
    ---------------------------------------------------------------------
    Notes: 
     (1) 
**************************************************************************/


/*************************************************************************
// Global variables
**************************************************************************/

// Style (Fonts, colors)
var hexArrayR = [];
hexArrayR[0] = '#582841';
hexArrayR[1] = '#351827';
hexArrayR[2] = '#CE2949';
hexArrayR[3] = '#EF4648';
hexArrayR[4] = '#F36E38';
hexArrayR[5] = '#F89E4C';

// Images


// Sounds


// Buttons and timers


//////////////////// p5 play variables

// Scene
var SCENE_W;
var SCENE_H;

// Main Sprite
var mainsprite;
var mainspriteW = 50;
var mainspriteH = 80;

// Main Sprite Controls
var speedleftup = 0;
var speedrightdown = 0;
var facing = 1;
var isidle = 0;
var stamina = 200;


/*************************************************************************
// Window resize
**************************************************************************/

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

/*************************************************************************
// Function preload
**************************************************************************/
function preload() {
  // Fonts

  // Images

  // Music and Sounds

}

/*************************************************************************
// Function setup
**************************************************************************/

function setup() {
  createCanvas(windowWidth, windowHeight);


  //////////////////// p5 play setup
  SCENE_W = windowWidth/2;
  SCENE_H = windowHeight/2;

  // Sprites
  mainsprite = createSprite(SCENE_W, SCENE_H, mainspriteW, mainspriteH);

  // mainsprite
  var mainspriteMove = mainsprite.addAnimation('idle',
    'assets/img/mainsprite/idle_1.png', 'assets/img/mainsprite/idle_2.png', 'assets/img/mainsprite/idle_3.png');
  mainsprite.addAnimation('moving', 'assets/img/mainsprite/walk_1.png', 'assets/img/mainsprite/walk_2.png', 'assets/img/mainsprite/walk_3.png', 'assets/img/mainsprite/walk_4.png', 'assets/img/mainsprite/walk_5.png');
 }

/*************************************************************************
// Function draw
**************************************************************************/

function draw() {
  background(hexArrayR[0]);

  // draw the main sprite;
  drawSprites();
  drawMainSprite();
  // fsMessage();
}


/*************************************************************************
// Fullscreen function
**************************************************************************/
// Fullscreen message
function fsMessage() {
  push();
  fill(255);
  noStroke();
  textSize(width/60);
  textAlign(LEFT);
  text("Press [F] for fullscreen", 0 + width/100 , height - height/100)
  pop();
}

// keyTyped for debugMode and fullscreen
function keyTyped() {
  if (key === 'f') {
    let fs = fullscreen();
    fullscreen(!fs);
  }
 }

 /*************************************************************************
// p5 play functions
**************************************************************************/

function drawMainSprite() {
  //accelerate with shift
  if ((keyIsDown(16)) && (stamina >= 0)) {
    speedleftup -= 0.1;
    speedrightdown += 0.1;
    stamina -= 2.5;
  } else {
    speedleftup = 0;
    speedrightdown = 0;
    stamina += 2;
  }
  //keep stamina within 0 to 200 points
  if (stamina >= 200) {
    stamina = 200;
  }
  if (stamina <= 0) {
    stamina = 0;
  }
  //if stamina runs out, cannot run anymore
  if (stamina == 0) {
    mainsprite.velocity.x = -4;
    mainsprite.velocity.y = -4;
    speedleftup = 0;
    speedrightdown = 0;
  }

  //control mainsprite with WASD
  //left with A
  if (keyIsDown(65)) {
    mainsprite.changeAnimation('moving');
    mainsprite.mirrorX(-1);
    mainsprite.velocity.x = -4 + speedleftup;
    facing = -1;
    isidle = 1;
  }
  //right with D
  else if (keyIsDown(68)) {
    mainsprite.changeAnimation('moving');
    mainsprite.mirrorX(1);
    mainsprite.velocity.x = 4 + speedrightdown;
    facing = 1;
    isidle = 1;
  }
  //down with S
  else if (keyIsDown(83)) {
    mainsprite.changeAnimation('moving');
    mainsprite.velocity.y = 4 + speedrightdown;
    isidle = 1;
  }
  //up with W
  else if (keyIsDown(87)) {
    mainsprite.changeAnimation('moving');
    mainsprite.velocity.y = -4 + speedleftup;
    isidle = 1;
  } else {
    mainsprite.changeAnimation('idle');
    mainsprite.velocity.x = 0;
    mainsprite.velocity.y = 0;
    isidle = 0;
  }

  //trapping the main sprite inside the screen width/height
 if (mainsprite.position.x < 0 + mainspriteW - mainspriteW/2)
    mainsprite.position.x = 0 + mainspriteW - mainspriteW/2;
  if (mainsprite.position.y < 0 + mainspriteH/2)
    mainsprite.position.y = 0 + mainspriteH/2;
  if (mainsprite.position.x > width - mainspriteW + mainspriteW/2)
    mainsprite.position.x = width - mainspriteW + mainspriteW/2;
  if (mainsprite.position.y > height - mainspriteH/2)
    mainsprite.position.y = height - mainspriteH/2;

  //shadow underneath the main sprite
  push();
  noStroke();
  fill(25, 25, 25, 70);
  ellipse(mainsprite.position.x, mainsprite.position.y + mainspriteH/2, mainspriteW+mainspriteW/3, mainspriteH/6);
  pop();

  // if the shift key is down OR stamina is less than 180 pts; then draw the stamina bar above head of mainsprite
  if ((keyIsDown(16)) || (stamina <= 180)) {
    // draw the stamina bar
    drawStamina();
  }
}

function drawStamina() {
  push();
  rectMode(CORNER);
  noStroke();
  fill(hexArrayR[1]);
  rect(mainsprite.position.x - mainspriteW/1.5, mainsprite.position.y - mainspriteH+mainspriteH/10, 210/3, 15);
  fill(hexArrayR[5]);
  rect(mainsprite.position.x + 15/4 - mainspriteW/1.5, mainsprite.position.y + 15/4 - mainspriteH+mainspriteH/10, stamina/3, 7.5);
  pop();
}