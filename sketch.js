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

// Playersprite
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
var facingupdown = 1;
var isidle = 0;
var stamina = 200;

// NPCS
var npcW = 25;
var npcH = 40;

// Dialogue
var talkBubble;
var dialogueVisible = false;
var dialogueX = 1366/2 - 900/2;
var dialogueY = 768 - 300 - 50;
var currentDialogue = 'dialogue';
var currentDialogueName = 'name';

// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects

// Indexes into the clickable array (constants)
const playGameIndex = 0;

// Colors
var hexRed = [];
hexRed[0] = '#98201B';
hexRed[1] = '#AD4D49';
hexRed[2] = '#721814';

var hexGreen = [];
hexGreen[0] = '#458C6F';
hexGreen[1] = '#6AA38C';
hexGreen[2] = '#346953';

var hexGold = [];
hexGold[0] = '#F4A93D';
hexGold[1] = '#F6BA64';
hexGold[2] = '#B77F2E';

var hexTurquoise = [];
hexTurquoise[0] = '#53E0BF';
hexTurquoise[1] = '#75E6CC';
hexTurquoise[2] = '#3EA88F';

var hexDark = [];
hexDark[0] = '#222222';
hexDark[1] = '#4E4E4E';
hexDark[2] = '#1A1A1A';
hexDark[3] = '#FDF1E0';

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

  // Images
  talkBubble = loadImage('assets/dialogue/box.png');
}

/*************************************************************************
// Function setup
**************************************************************************/
function setup() {
    createCanvas(1366, 768);

    // Style  ----------------------------------
    textSize(25);
    textFont(fontCairo);
    fill(hexDark[0]);

    // Clickables  ----------------------------------
    // setup the clickables = this will allocate the array
    clickables = clickablesManager.setup();

    // Sprites  ----------------------------------
    // Player Sprite
    playerSprite = createSprite(970, 300, playerSpriteW, playerSpriteH);
    var playerSpriteMove = playerSprite.addAnimation('idle_f',
    'assets/avatars/idle_f_1.png', 'assets/avatars/idle_f_2.png', 'assets/avatars/idle_f_3.png', 'assets/avatars/idle_f_2.png', 'assets/avatars/idle_f_1.png');
    playerSprite.addAnimation('moving', 'assets/avatars/walk_1.png', 'assets/avatars/walk_2.png', 'assets/avatars/walk_3.png', 'assets/avatars/walk_4.png', 'assets/avatars/walk_5.png', 'assets/avatars/walk_6.png','assets/avatars/walk_7.png', 'assets/avatars/walk_8.png',);
    playerSprite.addAnimation('idle_b',
    'assets/avatars/idle_b_1.png', 'assets/avatars/idle_b_2.png', 'assets/avatars/idle_b_3.png', 'assets/avatars/idle_b_2.png', 'assets/avatars/idle_b_1.png');
    playerSprite.addAnimation('idle_f_large',
    'assets/avatars/large/idle_f_1.png', 'assets/avatars/large/idle_f_2.png', 'assets/avatars/large/idle_f_3.png', 'assets/avatars/large/idle_f_2.png', 'assets/avatars/large/idle_f_1.png');
    playerSprite.addAnimation('moving_large', 'assets/avatars/large/walk_1.png', 'assets/avatars/large/walk_2.png', 'assets/avatars/large/walk_3.png', 'assets/avatars/large/walk_4.png', 'assets/avatars/large/walk_5.png', 'assets/avatars/large/walk_6.png','assets/avatars/large/walk_7.png', 'assets/avatars/large/walk_8.png',);
    playerSprite.addAnimation('idle_b_large',
    'assets/avatars/large/idle_b_1.png', 'assets/avatars/large/idle_b_2.png', 'assets/avatars/large/idle_b_3.png', 'assets/avatars/large/idle_b_2.png', 'assets/avatars/large/idle_b_1.png');

    // Enemy Sprite
    creepSprite1 = createSprite(playerSprite.position.x + 300, playerSprite.position.y, playerSpriteW, playerSpriteH);
    creepSprite1.addAnimation('brunet',  loadAnimation('assets/NPCs/creep_b_1.png', 'assets/NPCs/creep_b_2.png'));

    creepSprite2 = createSprite(playerSprite.position.x + 350, playerSprite.position.y, playerSpriteW, playerSpriteH);
    creepSprite2.addAnimation('blond',  loadAnimation('assets/NPCs/creep_y_1.png', 'assets/NPCs/creep_y_2.png'));

    // Adventure Manager  ----------------------------------
    // Use this to track movement from room to room in adventureManager.draw()
    adventureManager.setPlayerSprite(playerSprite);

    // This is optional, but will manage turning visibility of buttons on/off based on the state name in the clickableLayout
    adventureManager.setClickableManager(clickablesManager);

    // This will load the images, go through state and interation tables, etc
    adventureManager.setup();

    // changedState is the name of a callback function
    adventureManager.setChangedStateCallback(changedState);

    // Call our function to setup additional information about the p5.clickables that are not in the array 
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
        adventureManager.getStateName() !== "Instructions" &&
        adventureManager.getStateName() !== "About" ) {
        
    // Sprites
    // Player sprite responds to key commands
    moveSprite();

    // Debug to see player position
    // showPlayerPos();

    // Draw player sprite
    drawSprite(playerSprite);

    // Draw enemy NPCs
    if( adventureManager.getStateName() !== "Splash" && 
        adventureManager.getStateName() !== "Instructions" &&
        adventureManager.getStateName() !== "About" &&
        adventureManager.getStateName() !== "House" && 
        adventureManager.getStateName() !== "Restaurant" &&
        adventureManager.getStateName() !== "Upstart") {
      drawEnemyNPCs();
    }

    // Draw dialogue over everything else
    drawDialogueBox();

    frameRate(47);
  } 
}

function keyPressed() {
  // toggle fullscreen mode
  if( key === 'f') {
    fs = fullscreen();
    fullscreen(!fs);
    return;
  }

  // Dispatch key events for adventure manager to move from state to state or do special actions
  // This can be disabled for NPC conversations or text entry   
  adventureManager.keyPressed(key); 
}

function mouseReleased() {
  adventureManager.mouseReleased();
}

// Moves the playerSprite based on room exit & entry
function changedState(currentStateStr, newStateStr) {
  // print("changedState callback:");
  // print("current state = " + currentStateStr);
  // print("new state = " + newStateStr);

  if (currentStateStr === 'House' && newStateStr === 'Map12') {
    movePlayerSprite(800, 545);
  }
  else if (currentStateStr === 'Map12' && newStateStr === 'House') {
    movePlayerSprite(327.6839, 719.1834);
  }
  else if (currentStateStr === 'Restaurant' && newStateStr === 'Map11') {
    movePlayerSprite(730, 545);
  }
  else if (currentStateStr === 'Map11' && newStateStr === 'Restaurant') {
    movePlayerSprite(683, 689.428);
  }
  else if (currentStateStr === 'Map7' && newStateStr === 'Upstart') {
    movePlayerSprite(998.2419, 710.0504);
  }
  else if (currentStateStr === 'Upstart' && newStateStr === 'Map7') {
    movePlayerSprite(595, 545);
  }
}

/*************************************************************************
// Sprites
**************************************************************************/
function showPlayerPos() {
  push();
  fill(255);
  text(playerSprite.position.x, 20, 40);
  text(playerSprite.position.y, 20, 70);
  pop();
}

function playerAnimationSizeTest(x, y) {
    if( adventureManager.getStateName() === "House" || 
        adventureManager.getStateName() === "Restaurant" ||
        adventureManager.getStateName() === "Upstart") {
      playerSprite.changeAnimation(x);
    }
    else {
      playerSprite.changeAnimation(y);
    }
}

function moveSprite() {
  playerSprite.maxSpeed = 10;
  //control playerSprite with WASD
  //left with A
  if (keyIsDown(65)) {
    playerAnimationSizeTest('moving_large', 'moving');
    playerSprite.mirrorX(-1);
    playerSprite.velocity.x = -4 + speedleft;
    facing = -1;
    isidle = 1;
  }
  //right with D
  else if (keyIsDown(68)) {
    playerAnimationSizeTest('moving_large', 'moving');
    playerSprite.mirrorX(1);
    playerSprite.velocity.x = 4 + speedright;
    facing = 1;
    isidle = 1;
  }
  //down with S
  else if (keyIsDown(83)) {
    playerAnimationSizeTest('moving_large', 'moving');
    playerSprite.velocity.y = 4 + speeddown;
    isidle = 1;
    facingupdown = 1;
  }
  //up with W
  else if (keyIsDown(87)) {
    playerAnimationSizeTest('moving_large', 'moving');
    playerSprite.velocity.y = -4 + speedup;
    isidle = 1;
    facingupdown = 0;
  } 
  else if (facingupdown === 0) {
    playerAnimationSizeTest('idle_b_large', 'idle_b');
    playerSprite.velocity.x = 0;
    playerSprite.velocity.y = 0;
    isidle = 0;
  }
  else if (facingupdown === 1) {
    playerAnimationSizeTest('idle_f_large', 'idle_f');
    playerSprite.velocity.x = 0;
    playerSprite.velocity.y = 0;
    isidle = 0;
  }

  // spacebar to use power
  if ((keyIsDown(32)) && (stamina >= 0))  {
    fill(hexGold[0]);
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

  drawPlayerShadow();

  // if the shift key is down AND stamina is less than 180 pts; then draw the stamina bar above head of playerSprite
  if ((keyIsDown(16)) && (stamina <= 190)) {
    // draw the stamina bar
    drawStamina();
  } else if (stamina <= 180) {
    drawStamina();
  }
}

function drawPlayerShadow() {
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
}

function drawStamina() {
  if( adventureManager.getStateName() !== "House" && 
      adventureManager.getStateName() !== "Restaurant" &&
      adventureManager.getStateName() !== "Upstart" ) {
    push();
    rectMode(CORNER);
    noStroke();
    fill(hexDark[1]);
    rect(playerSprite.position.x - playerSpriteW, 
      playerSprite.position.y - playerSpriteH - 50, 210/3, 15);
    fill(hexTurquoise[0]);
    rect(playerSprite.position.x + 15/4 - playerSpriteW, playerSprite.position.y + 15/4 - playerSpriteH - 50, stamina/3, 7.5);
    pop();
  }
}

function movePlayerSprite(x, y) {
  playerSprite.position.x = x;
  playerSprite.position.y = y;
}

/*************************************************************************
// Enemy NPCs
**************************************************************************/
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

/*************************************************************************
// Dialogue
**************************************************************************/
function drawDialogueBox() {
  if (dialogueVisible === true) {
    image(talkBubble, dialogueX, dialogueY);
    drawDialogueText();
  }
}

 function drawDialogueText() {
  // Dialogue Name
  push();
  textSize(30);
  textFont(fontChangaBold);
  fill(hexGold[1]);
  text(currentDialogueName, dialogueX + 100, dialogueY + 70);
  pop();
  // Dialogue
  push();
  textSize(20);
  textFont(fontCairo);
  fill(hexDark[3]);
  text(currentDialogue, dialogueX + 100, dialogueY + 80, 650, 150);
  pop();
 }

 function drawEnterText() {
    push();
    textAlign(CENTER);
    textFont(fontChangaBold);
    fill(hexDark[3]);
    stroke(hexDark[0]);
    strokeWeight(3);
    textSize(22);
    text('Press [E] to enter', playerSprite.position.x, playerSprite.position.y - playerSpriteH - 50);
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
  this.color = hexTurquoise[1];
  this.noTint = false;
  this.tint = null;
  this.textSize = 28;
}

clickableButtonOnOutside = function () {
  this.color = hexTurquoise[2];
  this.stroke = hexDark[3];
  this.strokeWeight = 1;
  this.textColor = hexDark[3];
  this.textSize = 24;
  this.textFont = fontChanga;
  this.cornerRadius = 15;
  this.textY = -5;
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
class InstructionsScreen extends PNGRoom {
  preload() {
    // These are out variables in the InstructionsScreen class
    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*4; 

    // Hard-coded, but this could be loaded from a file if we wanted to be more elegant
    this.instructionsTitle = "••• CONTENT WARNING •••"
    this.instructionsText = "This game experience involves the following:\n\n\n• Violence, blood, and gore\n• Death of family members\n• Sexual harassment and racial fetishization\n• Sex work and prostitution\n• Body image and mentions of weight\n• Bright colors which may cause eyestrain";
    this.offsetY = 40;
  }

  draw() {
    // tint down background image so text is more readable
    tint(128);
      
    // this calls PNGRoom.draw()
    super.draw();
      
    // text
    fill(hexDark[3]);
    textAlign(LEFT);
    textSize(26);
    text(this.instructionsText, width/4, height/6 + this.offsetY, this.textBoxWidth, this.textBoxHeight);

    // title
    textAlign(CENTER);
    textSize(34);
    text(this.instructionsTitle, width/6, height/6 - this.offsetY, this.textBoxWidth, this.textBoxHeight);
  }
}

class AboutScreen extends PNGRoom {
  preload() {
    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*5.5; 

    this.aboutText = "Streetlamp is a game which satirizes Orientalist tendencies in physical and fictional environments. By exploring anti-Asian racism within visual and storytelling mediums that bleeds into the real world, it calls attention to the fetishization and sexualization Asian women suffer, in addition to criticizing tired racist tropes and stereotypes which are commonplace in Western media.\n\n\nThe game derives its name from two components: firstly, the 'sexy lamp' trope in which female characters are reduced to being sex objects as functional as lamps, and secondly, the design of the Dragon Street Lamp by W. D’Arcy Ryan (1925) in San Francisco's Chinatown, representative of Chinatown's larger Orientalist design direction developed in the 20th century, which still to this day draws tourists to gawk at and admire foreign lands which only exist in their imagination."
  }

  draw() {
    tint(128);
    super.draw();
    
    fill(hexDark[3]);
    textAlign(LEFT);
    textSize(24);

    text(this.aboutText, width/6, height/6, this.textBoxWidth, this.textBoxHeight);
  }
}


// Map Rooms
class Map7Room extends PNGRoom {
  preload() {
      this.drawUpstartHouseX = 598.4133;
      this.drawUpstartHouseY = 518.3071 - 379/2;
      this.upstartHouse = createSprite( this.drawUpstartHouseX, this.drawUpstartHouseY, 281, 379);
      this.upstartHouse.addAnimation('regular',  loadAnimation('assets/buildings/upstart.png'));
      this.upstartHouseSpriteCollide = createSprite(this.drawUpstartHouseX, 520, 100, 20);
  }

  draw() {
    super.draw();
    drawSprite(this.upstartHouse);
    if (playerSprite.overlap(this.upstartHouseSpriteCollide)) {
      drawEnterText();
    }
    if (playerSprite.overlap(this.upstartHouseSpriteCollide) && keyIsDown(69)) {
      this.enter();
    }
  }

  enter() {
    adventureManager.changeState("Upstart");
  }
}

class Map11Room extends PNGRoom {
  preload() {
      this.drawRestaurantX = 683;
      this.drawRestaurantY = 518.3071 - 379/2;
      this.restaurantSprite = createSprite( this.drawRestaurantX, this.drawRestaurantY, 555, 379);
      this.restaurantSprite.addAnimation('regular',  loadAnimation('assets/buildings/restaurant.png'));
      this.restaurantSpriteCollide = createSprite(this.drawRestaurantX, 520, 100, 20);
  }

  draw() {
    super.draw();
    drawSprite(this.restaurantSprite);

    if (playerSprite.overlap(this.restaurantSpriteCollide)) {
      drawEnterText();
    }

    if (playerSprite.overlap(this.restaurantSpriteCollide) && keyIsDown(69)) {
      this.enter();
    }
  }

  enter() {
    adventureManager.changeState("Restaurant");
  }
}

class Map12Room extends PNGRoom {
  preload() {
      this.drawHouseX = 770;
      this.drawHouseY = 372.4025 - 478/5;
      this.houseSprite = createSprite( this.drawHouseX, this.drawHouseY, 227, 478);
      this.houseSprite.addAnimation('regular',  loadAnimation('assets/buildings/house.png'));
      this.houseSpriteCollide = createSprite(this.drawHouseX, 519, 100, 20);

      this.houseSpriteA = createSprite( this.drawHouseX - 250, this.drawHouseY, 228, 479);
      this.houseSpriteA.addAnimation('regular',  loadAnimation('assets/buildings/house_z1a.png'));

      this.houseSpriteB = createSprite( this.drawHouseX + 250, this.drawHouseY, 228, 479);
      this.houseSpriteB.addAnimation('regular',  loadAnimation('assets/buildings/house_z1b.png'));

      this.lampSprite = createSprite(300, 520 - 478/2, 113, 478);
      this.lampSprite.addAnimation('regular',  loadAnimation('assets/objects/lamp_1.png', 'assets/objects/lamp_2.png', 'assets/objects/lamp_3.png', 'assets/objects/lamp_4.png','assets/objects/lamp_5.png', 'assets/objects/lamp_4.png', 'assets/objects/lamp_3.png', 'assets/objects/lamp_2.png', 'assets/objects/lamp_1.png'));
  }

  draw() {
    // draw background
    super.draw();

    // draw sprites
    drawSprite(this.houseSprite);
    drawSprite(this.houseSpriteA);
    drawSprite(this.houseSpriteB);

    drawSprite(this.lampSprite);

    // Draw press E to enter text
    if (playerSprite.overlap(this.houseSpriteCollide)) {
      drawEnterText();
    }

    // Enter the building
    if (playerSprite.overlap(this.houseSpriteCollide) && keyIsDown(69)) {
      this.enter();
    }
  }

  enter() {
    adventureManager.changeState("House");
  }
}


// Individual Rooms
class HouseRoom extends PNGRoom {
  preload() {
      this.npcX = width/4;
      this.npcY = height/2;

      this.liNPCSprite = createSprite(this.npcX, this.npcY, npcW, npcH);
      this.liNPCSprite.addAnimation('idle',  loadAnimation('assets/NPCs/npc_li_1.png', 'assets/NPCs/npc_li_2.png', 'assets/NPCs/npc_li_3.png', 'assets/NPCs/npc_li_2.png', 'assets/NPCs/npc_li_1.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.liNPCSprite);
    this.liNPCSprite.setCollider('rectangle', 0, -20, 25, 40);
    playerSprite.collide(this.liNPCSprite);

    if (playerSprite.overlap(this.liNPCSprite)) {
      dialogueVisible = true;
      currentDialogueName = 'Li';
      currentDialogue = 'Ren, wake the fuck up! Our parents are dead. It’s up to you to reclaim our family honor.';
    } 
    else {
      dialogueVisible = false;
    }
  }
}

class RestaurantRoom extends PNGRoom {
  preload() {
      this.npcX = 707.2549;
      this.npcY = 308.0991 ;

      this.ppNPCSprite = createSprite(this.npcX, this.npcY, npcW, npcH);
      this.ppNPCSprite.addAnimation('idle',  loadAnimation('assets/NPCs/npc_pp_1.png', 'assets/NPCs/npc_pp_2.png', 'assets/NPCs/npc_pp_1.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.ppNPCSprite);
    this.ppNPCSprite.setCollider('rectangle', 0, -20, 25, 40);
    playerSprite.collide(this.ppNPCSprite);

    if (playerSprite.overlap(this.ppNPCSprite)) {
      dialogueVisible = true;
      currentDialogueName = 'Paw Paw Potsticker';
      currentDialogue = 'Oh Ren, it’s so good to see you!';
    } 
    else {
      dialogueVisible = false;
    }
  }
}

class UpstartRoom extends PNGRoom {
  preload() {
      this.npcX = 476.1189;
      this.npcY = 321.1925;

      this.usNPCSprite = createSprite(this.npcX, this.npcY, npcW, npcH);
      this.usNPCSprite.addAnimation('idle',  loadAnimation('assets/NPCs/npc_upstart_1.png', 'assets/NPCs/npc_upstart_2.png', 'assets/NPCs/npc_upstart_3.png', 'assets/NPCs/npc_upstart_2.png', 'assets/NPCs/npc_upstart_1.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.usNPCSprite);
    this.usNPCSprite.setCollider('rectangle', 0, -20, 25, 40);
    playerSprite.collide(this.usNPCSprite);

    if (playerSprite.overlap(this.usNPCSprite)) {
      dialogueVisible = true;
      currentDialogueName = 'The Upstart';
      currentDialogue = 'Tch... hey kid.';
    } 
    else {
      dialogueVisible = false;
    }
  }
}


class BrothelRoom extends PNGRoom {
  preload() {
      this.npcX = 476.1189;
      this.npcY = 321.1925;

      this.aNPCSprite = createSprite(this.npcX, this.npcY, npcW, npcH);
      this.aNPCSprite.addAnimation('idle',  loadAnimation('assets/NPCs/npc_aunties_1.png', 'assets/NPCs/npc_aunties_2.png', 'assets/NPCs/npc_aunties_1.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.aNPCSprite);
    this.aNPCSprite.setCollider('rectangle', 0, -20, 50, 40);
    playerSprite.collide(this.aNPCSprite);

    if (playerSprite.overlap(this.aNPCSprite)) {
      dialogueVisible = true;
      currentDialogueName = 'Aunties';
      currentDialogue = 'Oh, hello Ren! What brings you all the way to the entertainment district?';
    } 
    else {
      dialogueVisible = false;
    }
  }
}