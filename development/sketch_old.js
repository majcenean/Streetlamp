/*************************************************************************
 ART385 Project 2
          by Maj Jenkins
    April 20, 2021

    Overview:
    
    ---------------------------------------------------------------------
    Notes: 
     (1) 
**************************************************************************/


/*************************************************************************
// Global variables
**************************************************************************/
// adventure manager global  
var adventureManager;

// p5.pla7
var playerSprite;
var playerAnimation;

// Debug
var debugScreen;
var showDebugScreen = false;

// Variable that is a function 
// var drawFunction;

// Clickables
// Manager class
var clickablesManager;
// Array of clickable objects
var clickables;
// indexes into the array (constants) - look at the clickableLayout.csv
const cl1 = 0;
const cl2 = 1;
const cl3 = 2;
const cl4 = 3;
const cl5 = 4;

// indexes into the array (constants)
const playGameIndex = 0;
const chooseAvatarIndex = 1;
const doneIndex = 2;


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

var fontChanga;
var fontCairo;

// Images


// Sounds

var clickL;
var clickH;


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
var facing = -1;
var isidle = 0;
var stamina = 200;

/*************************************************************************
// Function preload
**************************************************************************/
function preload() {
  // Debug
  debugScreen = new DebugScreen();

  // Clickables and Adventure
  clickablesManager = new ClickableManager('assets/data/clickableLayout.csv');
  adventureManager = new AdventureManager('assets/data/adventureStates.csv', 'assets/data/interactionTable.csv', 'assets/data/clickableLayout.csv');
  // interactionTable = loadTable('data/interactionTable.csv', 'csv', 'header');

  // Fonts
  fontChanga = loadFont('assets/font/Changa.otf');
  fontCairo = loadFont('assets/font/Cairo.otf');

  // Images

  // Music and Sounds
  clickL = loadSound('assets/sfx/click_low.mp3');
  clickH = loadSound('assets/sfx/click_high.mp3');
}

/*************************************************************************
// Function setup
**************************************************************************/

function setup() {
  createCanvas(1366, 768);
  textSize(25);
  textFont(fontCairo);
  fill(hexArrayR[5]);
  noStroke();

  // Debug
  debugScreen.print("hi");

  // State
  // Set to first state for startup
    // drawFunction = state1;

  // Clickables
  // Setup the clickables = this will allocate the array
  clickables = clickablesManager.setup();

  // Sprites
    mainsprite = createSprite(width/2, height/2, mainspriteW, mainspriteH);

    // mainsprite
    var mainspriteMove = mainsprite.addAnimation('idle',
      'assets/img/mainsprite/idle_1.png', 'assets/img/mainsprite/idle_2.png', 'assets/img/mainsprite/idle_3.png');
    mainsprite.addAnimation('moving', 'assets/img/mainsprite/walk_1.png', 'assets/img/mainsprite/walk_2.png', 'assets/img/mainsprite/walk_3.png', 'assets/img/mainsprite/walk_4.png', 'assets/img/mainsprite/walk_5.png');

  // Adventure Manager
  // use this to track movement from room to room in adventureManager.draw()
  adventureManager.setPlayerSprite(playerSprite);

  // this is optional but will manage turning visibility of buttons on/off
  // based on the state name in the clickableLayout
  adventureManager.setClickableManager(clickablesManager);

  // This will load the images, go through state and interation tables, etc
  adventureManager.setup();

  // Clickables
  // call OUR function to setup additional information about the p5.clickables
  // that are not in the array 
  setupClickables(); 
  }

/*************************************************************************
// Function draw
**************************************************************************/

function draw() {
  background(hexArrayR[0]);

   // draws background rooms and handles movement from one to another
  adventureManager.draw();

  // Debug Screen
  if( showDebugScreen ) {
    debugScreen.draw();
  }

  // Clickables
  clickablesManager.draw();

  // Draw the main sprite;
  drawSprite(mainsprite);
  drawMainSprite();

  // State
  // drawFunction();

  // fsMessage();
  // noCursor();
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
  else if( key === 'i') {
    showDebugScreen = !showDebugScreen;
  }
  else {
    // dispatch to elsewhere
    adventureManager.keyPressed(key); 
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

 function mouseReleased() {
  adventureManager.mouseReleased();
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
    mainsprite.mirrorX(1);
    mainsprite.velocity.x = -4 + speedleft;
    facing = 1;
    isidle = 1;
  }
  //right with D
  else if (keyIsDown(68)) {
    mainsprite.changeAnimation('moving');
    mainsprite.mirrorX(-1);
    mainsprite.velocity.x = 4 + speedright;
    facing = -1;
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
  push();
  fill('#ffffff10');
  ellipse(mainsprite.position.x, mainsprite.position.y, 200, 200);
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
// Clickables
**************************************************************************/
// change individual fields of the clickables
function setupClickables() {
  // make same callback handlers for all 4 clickables
  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].onPress = clickableButtonPressed;
    clickables[i].onHover = clickableButtonHover;
    clickables[i].onOutside = clickableButtonOnOutside;
  }
}

//--- CLICKABLE CALLBACK FUNCTIONS ----
clickableButtonPressed = function () {
  if( this.id === cl1 ) {
    if (drawFunction === state1) {
      clickL.play();
    } 
    else {
      drawFunction = state1;
      clickH.play();
    }
  }

  else if( this.id === cl2 ) {
    if (drawFunction === state2) {
      clickL.play();
    } 
    else {
      drawFunction = state2;
      clickH.play();
    }
  }

  else if( this.id === cl3 ) {
    if (drawFunction === state3) {
      clickL.play();
    } 
    else {
      drawFunction = state3;
      clickH.play();
    }
  }

  else if( this.id === cl4 ) {
    if (drawFunction === state4) {
      clickL.play();
    } 
    else {
      drawFunction = state4;
      clickH.play();
    }
  }

  else if( this.id === cl5 ) {
    if (drawFunction === state5) {
      clickL.play();
    } 
    else {
      drawFunction = state5;
      clickH.play();
    }
  }
}

// color when mouse focus
clickableButtonHover = function () {
  this.color = hexArrayR[0];
  this.noTint = false;
  this.tint = "#FF0000";
}

// color when no mouse focus
clickableButtonOnOutside = function () {
  this.color = "#5d465270";
  this.stroke = "#c2babe50";
  this.textColor = "#c2babe50";
  this.textSize = 25;
  this.textFont = fontChanga;
}


/*************************************************************************
// States
**************************************************************************/

state1 = function () {
    text('State 1', 50, 50);
}

state2 = function () {
    text('State 2', 50, 50);
}

state3 = function () {
    text('State 3', 50, 50);
}

state4 = function () {
    text('State 4', 50, 50);
}

state5 = function () {
    text('State 5', 50, 50);
}

/*************************************************************************
// Subclass
**************************************************************************/

class InstructionsScreen extends PNGRoom {
  // Constructor gets calle with the new keyword, when upon constructor for the adventure manager in preload()
  constructor() {
    super();    // call super-class constructor to initialize variables in PNGRoom

    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*4; 

    // hard-coded, but this could be loaded from a file if we wanted to be more elegant
    this.instructionsText = "You are navigating through the interior space of your moods. There is no goal to this game, but just a chance to explore various things that might be going on in your head. Use the ARROW keys to navigate your avatar around.";
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
    draw() {
      // tint down background image so text is more readable
      tint(128);
      
      // this calls PNGRoom.draw()
      super.draw();
      
      // text draw settings
      fill(255);
      textAlign(CENTER);
      textSize(30);

      // Draw text in a box
      text(this.instructionsText, width/6, height/6, this.textBoxWidth, this.textBoxHeight );
    }
}