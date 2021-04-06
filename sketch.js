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
// Adventure manager global  
var adventureManager;

// p5.play
var playerSprite;
var playerAnimation;
var playerSpriteW = 25;
var playerSpriteH = 40;

// PlayerSprite Controls
var speedleft = 0;
var speedright = 0;
var speedup = 0;
var speeddown = 0;
var facing = 1;
var isidle = 0;
var stamina = 200;

// House
var houseSprite;

// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects

// Indexes into the clickable array (constants)
const playGameIndex = 0;


// Colors
var hexArrayR = [];
hexArrayR[0] = '#582841';
hexArrayR[1] = '#351827';
hexArrayR[2] = '#CE2949';
hexArrayR[3] = '#EF4648';
hexArrayR[4] = '#F36E38';
hexArrayR[5] = '#F89E4C';

// Fonts
var fontChanga;
var fontCairo;

// Sounds
var clickL;
var clickH;


/*************************************************************************
// Function preload
**************************************************************************/
// Allocate Adventure Manager with states table and interaction tables
function preload() {
	// Clickables and Adventure
	clickablesManager = new ClickableManager('data/clickableLayout.csv');
	adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');

	// Fonts
	fontChanga = loadFont('font/Changa.otf');
	fontCairo = loadFont('font/Cairo.otf');

	// Music and Sounds
	clickL = loadSound('sfx/click_low.mp3');
	clickH = loadSound('sfx/click_high.mp3');
}

/*************************************************************************
// Function setup
**************************************************************************/
function setup() {
    createCanvas(1366, 768);

    // Style  ----------------------------------
    textSize(25);
    textFont(fontCairo);
    fill(hexArrayR[5]);

    // Clickables  ----------------------------------
    // setup the clickables = this will allocate the array
    clickables = clickablesManager.setup();

    // Sprites  ----------------------------------
    // create a sprite and add the 3 animations
    playerSprite = createSprite(615, 310, playerSpriteW, playerSpriteH);

    // playerSprite
    var playerSpriteMove = playerSprite.addAnimation('idle',
    'assets/avatars/idle_1.png');
    playerSprite.addAnimation('moving', 'assets/avatars/walk_1.png', 'assets/avatars/walk_2.png', 'assets/avatars/walk_3.png', 'assets/avatars/walk_4.png', 'assets/avatars/walk_5.png', 'assets/avatars/walk_6.png','assets/avatars/walk_7.png', 'assets/avatars/walk_8.png',);

    // Adventure Manager  ----------------------------------
    // Use this to track movement from room to room in adventureManager.draw()
    adventureManager.setPlayerSprite(playerSprite);

    // This is optional, but will manage turning visibility of buttons on/off
    // based on the state name in the clickableLayout
    adventureManager.setClickableManager(clickablesManager);

    // This will load the images, go through state and interation tables, etc
    adventureManager.setup();

    // call OUR function to setup additional information about the p5.clickables
    // that are not in the array 
    setupClickables(); 
}

/*************************************************************************
// Function draw
**************************************************************************/
function draw() {
    // Draws background rooms and handles movement from one to another
    adventureManager.draw();

    // Draw the p5.clickables, in front of the mazes but behind the sprites 
    clickablesManager.draw();

    // No avatar for Splash screen or Instructions screen
    if( adventureManager.getStateName() !== "Splash" && 
        adventureManager.getStateName() !== "Instructions" ) {
        
    // responds to keydowns
    moveSprite();

    // this is a function of p5.js, not of this sketch
    drawSprite(playerSprite);
  } 
}

function keyPressed() {
  // toggle fullscreen mode
  if( key === 'f') {
    fs = fullscreen();
    fullscreen(!fs);
    return;
  }

  // Dispatch key events for adventure manager to move from state to 
  // state or do special actions - this can be disabled for 
  // NPC conversations or text entry   

  // dispatch to elsewhere
  adventureManager.keyPressed(key); 
}

function mouseReleased() {
  adventureManager.mouseReleased();
}

/*************************************************************************
// playerSprite mobility functions
**************************************************************************/
function moveSprite() {
  playerSprite.maxSpeed = 10;
  //control playerSprite with WASD
  //left with A
  if (keyIsDown(65)) {
    playerSprite.changeAnimation('moving');
    playerSprite.mirrorX(-1);
    playerSprite.velocity.x = -4 + speedleft;
    facing = -1;
    isidle = 1;
  }
  //right with D
  else if (keyIsDown(68)) {
    playerSprite.changeAnimation('moving');
    playerSprite.mirrorX(1);
    playerSprite.velocity.x = 4 + speedright;
    facing = 1;
    isidle = 1;
  }
  //down with S
  else if (keyIsDown(83)) {
    playerSprite.changeAnimation('moving');
    playerSprite.velocity.y = 4 + speeddown;
    isidle = 1;
  }
  //up with W
  else if (keyIsDown(87)) {
    playerSprite.changeAnimation('moving');
    playerSprite.velocity.y = -4 + speedup;
    isidle = 1;
  } else {
    playerSprite.changeAnimation('idle');
    playerSprite.velocity.x = 0;
    playerSprite.velocity.y = 0;
    isidle = 0;
  }

  // spacebar to use power
  if ((keyIsDown(32)) && (stamina >= 0))  {
    fill(hexArrayR[3]);
    ellipse(playerSprite.position.x, playerSprite.position.y, 20, 20);
    stamina -= 10;
    playerSprite.velocity.x = 0;
    playerSprite.velocity.y = 0;
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
    playerSprite.velocity.x = 0;
    playerSprite.velocity.y = 0;
    speedleft = 0;
    speedright = 0;
    speedup = 0;
    speeddown = 0;
  }

  //trapping the main sprite inside the screen width/height
  // if (playerSprite.position.x < 0 + playerSpriteW - playerSpriteW/2)
  //   playerSprite.position.x = 0 + playerSpriteW - playerSpriteW/2;
  // if (playerSprite.position.y < 0 + playerSpriteH/2)
  //   playerSprite.position.y = 0 + playerSpriteH/2;
  // if (playerSprite.position.x > width - playerSpriteW + playerSpriteW/2)
  //   playerSprite.position.x = width - playerSpriteW + playerSpriteW/2;
  // if (playerSprite.position.y > height - playerSpriteH/2)
  //   playerSprite.position.y = height - playerSpriteH/2;

  //shadow underneath the main sprite
  push();
  noStroke();
  fill(25, 25, 25, 70);
  ellipse(playerSprite.position.x, playerSprite.position.y + playerSpriteH/2, playerSpriteW+playerSpriteW/3, playerSpriteH/6);
  pop();
  // little ellipse to see better
  push();
  fill('#ffffff10');
  noStroke();
  ellipse(playerSprite.position.x, playerSprite.position.y, 200, 200);
  pop();

  // if the shift key is down AND stamina is less than 180 pts; then draw the stamina bar above head of playerSprite
  if ((keyIsDown(16)) && (stamina <= 190)) {
    // draw the stamina bar
    drawStamina();
  } else if (stamina <= 180) {
    drawStamina();
  }
}

function drawStamina() {
  push();
  rectMode(CORNER);
  noStroke();
  fill(hexArrayR[1]);
  rect(playerSprite.position.x - playerSpriteW, 
    playerSprite.position.y - playerSpriteH - 50, 210/3, 15);
  fill(hexArrayR[5]);
  rect(playerSprite.position.x + 15/4 - playerSpriteW, playerSprite.position.y + 15/4 - playerSpriteH - 50, stamina/3, 7.5);
  pop();
}

/*************************************************************************
// Clickables
**************************************************************************/
function setupClickables() {
  // All clickables to have same effects
  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].onPress = clickableButtonPressed;
    clickables[i].onHover = clickableButtonHover;
    clickables[i].onOutside = clickableButtonOnOutside;
  }
}

clickableButtonHover = function () {
  this.color = hexArrayR[0];
  this.noTint = false;
  this.tint = "#FF0000";
}

clickableButtonOnOutside = function () {
  this.color = "#5d465270";
  this.stroke = "#c2babe50";
  this.textColor = "#c2babe50";
  this.textSize = 25;
  this.textFont = fontChanga;
}

clickableButtonPressed = function() {
  // Sound (before anything is called)
  clickH.play();

  // These clickables are ones that change the state
  // so they route to the adventure manager to do this
  adventureManager.clickablePressed(this.name);
}

/*************************************************************************
// Subclasses
**************************************************************************/
// Instructions screen has a background image, loaded from the adventureStates table.
// It is subclassed from PNGRoom, which means 
// all the loading, unloading and drawing of that class can be used. 
// We call super() to call the super class's function as needed
class InstructionsScreen extends PNGRoom {
  // Preload is where we define OUR variables
  preload() {
    // These are out variables in the InstructionsScreen class
    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*4; 

    // Hard-coded, but this could be loaded from a file if we wanted to be more elegant
    this.instructionsText = "You are navigating through the interior space of your moods. There is no goal to this game, but just a chance to explore various things that might be going on in your head. Use the ARROW keys to navigate your avatar around.";
  }

  // Call the PNGRoom superclass's draw function to draw the background image
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

// In the FeedMeRoom, you have a number of NPCs. We'll eventually make them
// moving, but for now, they are static. If you run into the NPC, you
// "die" and get teleported back to Start
class FeedMeRoom extends PNGRoom {
  // preload() gets called once upon startup
  // We load ONE animation and create 20 NPCs
  // 
  preload() {
     // load the animation just one time
    this.NPCAnimation = loadAnimation('assets/NPCs/bubbly0001.png', 'assets/NPCs/bubbly0004.png');
    
    // this is a type from p5play, so we can do operations on all sprites
    // at once
    this.NPCgroup = new Group;

    // change this number for more or less
    this.numNPCs = 20;

    // is an array of sprites, note we keep this array because
    // later I will add movement to all of them
    this.NPCSprites = [];

    // this will place them randomly in the room
    for( let i = 0; i < this.numNPCs; i++ ) {
      // random x and random y position for each sprite
      let randX  = random(100, width-100);
      let randY = random(100, height-100);

      // create the sprite
      this.NPCSprites[i] = createSprite( randX, randY, 80, 80);
    
      // add the animation to it (important to load the animation just one time)
      this.NPCSprites[i].addAnimation('regular', this.NPCAnimation );

      // add to the group
      this.NPCgroup.add(this.NPCSprites[i]);
    }
  }

  // pass draw function to superclass, then draw sprites, then check for overlap
  draw() {
    // PNG room draw
    super.draw();

    // draws all the sprites in the group
    this.NPCgroup.draw();

    // checks for overlap with ANY sprite in the group, if this happens
    // our class's die() function gets called
    playerSprite.overlap(this.NPCgroup, this.die);
  }

  // gets called when player sprite collides with an NPC
  // teleport back to start
  die() {
    adventureManager.changeState("Map12");
  }
}



// -----------------

class Map12Room extends PNGRoom {
  preload() {
    var houseImg = loadImage('assets/buildings/house.png');
    // this.houseAppearance = loadAnimation('assets/buildings/house.png');
    this.houseSprite = createSprite(900, 600, 80, 80);
    // this.houseSprite.addAnimation('normal', this.houseAppearance);
    this.houseSprite.addImage(houseImg);


    // this.boxSprite = createSprite(100, 150, 50, 100);
    // this.boxSprite.shapeColor = color(222, 125, 2);
  }

  draw() {
    super.draw();
    this.houseSprite.draw();
    // this.boxSprite.draw();
    playerSprite.overlap(this.houseSprite, this.enter);
  }

  enter() {
    adventureManager.changeState("House");
  }
}

