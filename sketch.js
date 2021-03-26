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
// Debug
var debugScreen;
var showDebugScreen = false;

// Data
var interactionTable;

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
var speedleft = 0;
var speedright = 0;
var speedup = 0;
var speeddown = 0;
var facing = 1;
var isidle = 0;
var stamina = 200;

/*************************************************************************
// Function preload
**************************************************************************/
function preload() {
  // Debug
  debugScreen = new DebugScreen();

  // Data
  // interactionTable = loadTable('data/interactionTable.csv', 'csv', 'header');

  // Fonts

  // Images

  // Music and Sounds

}

/*************************************************************************
// Function setup
**************************************************************************/

function setup() {
  createCanvas(1366, 768);

  // Debug
  debugScreen.print("hi");

  //////////////////// p5 play setup

  // Sprites
  mainsprite = createSprite(width/2, height/2, mainspriteW, mainspriteH);

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

  // Draw the main sprite;
  drawSprite(mainsprite);
  drawMainSprite();

  // Debug (leave at bottom so it shows up on top)
  if( showDebugScreen ) {
    debugScreen.draw();
  }

  // fsMessage();
  noCursor();
}


/*************************************************************************
// Keypressed function
**************************************************************************/
function keyPressed() {
  // Fullscreen
  if (key === 'f') {
    let fs = fullscreen();
    fullscreen(!fs);
  }

  // Debug
  if( key === 'i') {
    showDebugScreen = !showDebugScreen;
  }

  // // States Interaction Table
  // for (let i = 0; i < interactionTable.getRowCount(); i++) {
  //   if(interactionTable.getString(i, 'CurrentState') === drawFunction.name ) {
  //     if(interactionTable.getString(i, 'KeyTyped') === string(key) ) {
  //       drawFunction = eval(interactionTable.getString(i, 'NextState'));
  //     }
  //   }
  // }

 }

 // Fullscreen message
function fsMessage() {
  push();
  fill(255);
  noStroke();
  textSize(width/80);
  textAlign(LEFT);
  text("Press [F] for fullscreen", 0 + width/100 , height - height/100);
  text("Press [Tab] for debug screen", 0 + width/100 , height - height/100 - 25);
  pop();
}

/*************************************************************************
// Mainsprite mobility functions
**************************************************************************/
function drawMainSprite() {
  mainsprite.maxSpeed = 10;
  //control mainsprite with WASD
  //left with A
  if (keyIsDown(65)) {
    mainsprite.changeAnimation('moving');
    mainsprite.mirrorX(-1);
    mainsprite.velocity.x = -4 + speedleft;
    facing = -1;
    isidle = 1;
  }
  //right with D
  else if (keyIsDown(68)) {
    mainsprite.changeAnimation('moving');
    mainsprite.mirrorX(1);
    mainsprite.velocity.x = 4 + speedright;
    facing = 1;
    isidle = 1;
  }
  //down with S
  else if (keyIsDown(83)) {
    mainsprite.changeAnimation('moving');
    mainsprite.velocity.y = 4 + speeddown;
    isidle = 1;
  }
  //up with W
  else if (keyIsDown(87)) {
    mainsprite.changeAnimation('moving');
    mainsprite.velocity.y = -4 + speedup;
    isidle = 1;
  } else {
    mainsprite.changeAnimation('idle');
    mainsprite.velocity.x = 0;
    mainsprite.velocity.y = 0;
    isidle = 0;
  }

  // spacebar to use power
  if ((keyIsDown(32)) && (stamina >= 0))  {
    fill(hexArrayR[3]);
    ellipse(mainsprite.position.x, mainsprite.position.y, 20, 20);
    stamina -= 10;
    mainsprite.velocity.x = 0;
    mainsprite.velocity.y = 0;
    speedleft = 0;
    speedright = 0;
    speedup = 0;
    speeddown = 0;
  }

  //accelerate with shift
  if ((keyIsDown(16)) && (keyIsDown(65)) && (stamina >= 0)) {
    speedleft -= 0.1;
    stamina -= 2.5;
  } 
  else if ((keyIsDown(16)) && (keyIsDown(68)) && (stamina >= 0)) {
    speedright += 0.1;
    stamina -= 2.5;
  } 
  else if ((keyIsDown(16)) && (keyIsDown(83)) && (stamina >= 0)) {
    speeddown += 0.1;
    stamina -= 2.5;
  }
  else if ((keyIsDown(16)) && (keyIsDown(87)) && (stamina >= 0)) {
    speedup -= 0.1;
    stamina -= 2.5;
  }
  else {
    speedleft = 0;
    speedright = 0;
    speedup = 0;
    speeddown = 0;
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
    mainsprite.velocity.x = 0;
    mainsprite.velocity.y = 0;
    speedleft = 0;
    speedright = 0;
    speedup = 0;
    speeddown = 0;
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

/*************************************************************************
// States
**************************************************************************/
