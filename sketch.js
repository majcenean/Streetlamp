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
var playerSpriteX = 770;
var playerSpriteY = 543;

// PlayerSprite Controls
var speedleft = 0;
var speedright = 0;
var speedup = 0;
var speeddown = 0;
var facing = 1;
var facingupdown = 1;
var isidle = 0;
var stamina = 200;

// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects

// Indexes into the clickable array (constants)
const playGameIndex = 0;


// Colors
var hexArrayR = [];
hexArrayR[0] = '#98201B';
hexArrayR[1] = '#721814';
hexArrayR[2] = '#458C6F';
hexArrayR[3] = '#F4A93D';
hexArrayR[4] = '#53E0BF';
hexArrayR[5] = '#222222';
hexArrayR[6] = '#4E4E4E';
hexArrayR[7] = '#FDF1E0';

// Fonts
var fontChanga;
var fontChangaBold;
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
  fontChangaBold = loadFont('font/Changa_ExtraBold.otf');

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
    // Player Sprite
    playerSprite = createSprite(playerSpriteX, playerSpriteY, playerSpriteW, playerSpriteH);
    var playerSpriteMove = playerSprite.addAnimation('idle_f',
    'assets/avatars/idle_f_1.png', 'assets/avatars/idle_f_2.png', 'assets/avatars/idle_f_3.png', 'assets/avatars/idle_f_2.png', 'assets/avatars/idle_f_1.png');
    playerSprite.addAnimation('moving', 'assets/avatars/walk_1.png', 'assets/avatars/walk_2.png', 'assets/avatars/walk_3.png', 'assets/avatars/walk_4.png', 'assets/avatars/walk_5.png', 'assets/avatars/walk_6.png','assets/avatars/walk_7.png', 'assets/avatars/walk_8.png',);
    playerSprite.addAnimation('idle_b',
    'assets/avatars/idle_b_1.png', 'assets/avatars/idle_b_2.png', 'assets/avatars/idle_b_3.png', 'assets/avatars/idle_b_2.png', 'assets/avatars/idle_b_1.png');

    // Enemy Sprite
    creepSprite1 = createSprite(playerSpriteX + 300, playerSpriteY, playerSpriteW, playerSpriteH);
    creepSprite1.addAnimation('brunet',  loadAnimation('assets/NPCs/creep_b_1.png', 'assets/NPCs/creep_b_2.png'));

    creepSprite2 = createSprite(playerSpriteX + 350, playerSpriteY, playerSpriteW, playerSpriteH);
    creepSprite2.addAnimation('blond',  loadAnimation('assets/NPCs/creep_y_1.png', 'assets/NPCs/creep_y_2.png'));

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

    // No avatar shows up on Splash screen or Instructions screen
    if( adventureManager.getStateName() !== "Splash" && 
        adventureManager.getStateName() !== "Instructions" ) {
        
    // Sprites
    // Player sprite responds to key commands
    moveSprite();

    // Debug to see player position
    showPlayerPos();

    // Draw player sprite
    drawSprite(playerSprite);


    if( adventureManager.getStateName() !== "House") {
      // Draw enemy NPCs
      drawEnemyNPCs();
    }

    frameRate(47);
  } 
}

function showPlayerPos() {
  push();
  fill(255);
  text(playerSprite.position.x, 20, 40);
  text(playerSprite.position.y, 20, 70);
  pop();
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
    facingupdown = 1;
  }
  //up with W
  else if (keyIsDown(87)) {
    playerSprite.changeAnimation('moving');
    playerSprite.velocity.y = -4 + speedup;
    isidle = 1;
    facingupdown = 0;
  } 
  else if (facingupdown === 0) {
    playerSprite.changeAnimation('idle_b');
    playerSprite.velocity.x = 0;
    playerSprite.velocity.y = 0;
    isidle = 0;
  }
  else if (facingupdown === 1) {
    playerSprite.changeAnimation('idle_f');
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
  fill(hexArrayR[6]);
  rect(playerSprite.position.x - playerSpriteW, 
    playerSprite.position.y - playerSpriteH - 50, 210/3, 15);
  fill(hexArrayR[4]);
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
  die() {
    print('you died lol');
    // adventureManager.changeState("Map12");
  }
}



// -----------------

class Map12Room extends PNGRoom {
  preload() {
      // House Sprite
      this.drawHouseX = 770;
      this.drawHouseY = 372.4025 - 478/5;
      this.houseSprite = createSprite( this.drawHouseX, this.drawHouseY, 227, 478);
      this.houseSprite.addAnimation('regular',  loadAnimation('assets/buildings/house.png'));
      this.houseSpriteCollide = createSprite(this.drawHouseX, 519, 100, 20);

      this.houseSpriteA = createSprite( this.drawHouseX - 250, this.drawHouseY, 228, 479);
      this.houseSpriteA.addAnimation('regular',  loadAnimation('assets/buildings/house_z1a.png'));

      this.houseSpriteB = createSprite( this.drawHouseX + 250, this.drawHouseY, 228, 479);
      this.houseSpriteB.addAnimation('regular',  loadAnimation('assets/buildings/house_z1b.png'));

    //   // Creep Sprite
    //   this.drawCreep1X = 770 + 300;
    //   this.drawCreep1Y = 543;

    //   this.creepSprite1 = createSprite( this.drawCreep1X, this.drawCreep1Y, 50, 80);
    //   this.creepSprite1.addAnimation('regular',  loadAnimation('assets/NPCs/bubbly0001.png'));

    // // Moving the Creep
    //   this.creepSprite1.attractionPoint(0.2, playerSprite.position.x, playerSprite.position.y);
    //   this.creepSprite1.maxSpeed = 4;
  }

  draw() {
    super.draw();
    drawSprite(this.houseSprite);
    drawSprite(this.houseSpriteA);
    drawSprite(this.houseSpriteB);
    // drawSprite(this.creepSprite1);

    // Press E to enter text
    if (playerSprite.overlap(this.houseSpriteCollide)) {
      push();
      textAlign(CENTER);
      textFont(fontChangaBold);
      fill(hexArrayR[7]);
      stroke(hexArrayR[5]);
      strokeWeight(3);
      textSize(22);
      text('Press [E] to enter', playerSprite.position.x, playerSprite.position.y - playerSpriteH - 50);
      pop();
    }
    // Enter code
    if (playerSprite.overlap(this.houseSpriteCollide) && keyIsDown(69)) {
      this.enter();
    }
  }

  enter() {
    adventureManager.changeState("House");
  }
}

function drawEnemyNPCs() {
   setEnemySprite(creepSprite1);
   setEnemySprite(creepSprite2);
}

function setEnemySprite(spritename) {
  // Set attraction point
  spritename.attractionPoint(0.2, playerSprite.position.x, playerSprite.position.y);
  spritename.maxSpeed = 2;

  // Set animation flipping
  if(playerSprite.position.x < spritename.position.x - 10) {
    spritename.mirrorX(1);
  } 
  else if(playerSprite.position.x > spritename.position.x - 10) {
    spritename.mirrorX(-1);
  }

  // Set collisions with one another (so do not overlap)
  spritename.bounce(creepSprite1);
  spritename.bounce(creepSprite2);

  // Draw Sprite
  drawSprite(spritename);
}